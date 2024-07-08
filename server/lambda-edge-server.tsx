import AWS from "aws-sdk";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from "react-router-dom/server";
import { Writable } from "stream";
import { routes } from "../src/routes"; // @ts-ignore
import createFetchRequest from "./request";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
  Context,
} from "aws-lambda";

export type AWSResponseStream = Writable;

export type AWSStreamResponseMetadata = Pick<
  APIGatewayProxyStructuredResultV2,
  "statusCode" | "headers" | "cookies"
>;

export type AwsLambdaGlobal = {
  streamifyResponse: (
    handler: (
      event: any,
      response: AWSResponseStream,
      context: Context
    ) => Promise<void>
  ) => any;
  HttpResponseStream: {
    from: (
      stream: AWSResponseStream,
      httpResponseMetadata: AWSStreamResponseMetadata
    ) => AWSResponseStream;
  };
};

declare const awslambda: AwsLambdaGlobal;

class HtmlWritable extends Writable {
  chunks: any[] = [];
  html = "";

  getHtml() {
    return this.html;
  }

  _write(chunk: any, encoding: any, callback: any) {
    this.chunks.push(chunk);
    console.log("write");
    console.log(this.chunks);
    callback();
  }

  _final(callback: any) {
    this.html = Buffer.concat(this.chunks).toString();
    console.log("final");
    console.log(this.html);
    callback();
  }
}
let routerStaticHandler = createStaticHandler(routes);
const OMITTED_PATHS = [
  /^\/images\//,
  /^\/css\//,
  /^\/js\//,
  /^\/static\//,
  /^\/media\//,
  /\.(png|js|css|json|xml|txt|ico)$/,
];

const handler = async (event, context, callback) => {
  let request = event.Records[0].cf.request;
  const response = event.Records[0].cf.response;
  const host = request.headers?.host[0]?.value;

  console.log(request.uri);
  // Check if the request path matches any omitted path
  const shouldOmit = OMITTED_PATHS.some((path) => path.test(request.uri));

  if (shouldOmit) {
    // If path is omitted, return the response as is, without processing
    return callback(null, request); // Bypass Lambda and let CloudFront handle it
  }
  console.log("streamify");
  try {
    const stream = //awslambda.streamifyResponse(
      async (request, responseStream: any) => {
        console.log("writable");

        //const response = event.Records[0].cf.response;
        console.log(request.uri);
        const writable = new HtmlWritable();
        //const handler = async function (event: any) {
        try {
          console.log("s3");
          const s3 = new AWS.S3();
          /* if (["/", "/index.html", "/login", "login"].indexOf(request.uri) !== -1) { */
          const shouldOmit = OMITTED_PATHS.some((path) =>
            path.test(request.uri)
          );

          /* if (!shouldOmit) { */
          const params = {
            Bucket: "barberuy-s3-dev-ui",
            Key: "index.html",
          };
          const s3Object = await s3.getObject(params).promise();
          const data = s3Object.Body?.toString() || "";
          console.log(data);
          let url = request.uri === "/index.html" ? "" : request.uri;
          if (request.uri !== "/login") {
            let fetchRequest = createFetchRequest(
              url,
              request.headers,
              request.method,
              request.body,
              responseStream
            );
            let context = await routerStaticHandler.query(fetchRequest);
            let router = createStaticRouter(
              routerStaticHandler.dataRoutes,
              context as StaticHandlerContext
            );
            const { pipe } = ReactDOMServer.renderToPipeableStream(
              <StaticRouterProvider
                router={router}
                context={context as StaticHandlerContext}
              />,
              {
                onShellReady() {
                  console.log("shell ready");
                  pipe(writable);
                },
                onAllReady() {},
                onShellError() {
                  console.log("onshell error");
                  /* return {
                  status: 500,
                  statusDescription: "OK",
                  headers: {
                    "cache-control": [
                      {
                        key: "Cache-Control",
                        value: "max-age=100",
                      },
                    ],
                    "content-type": [
                      {
                        key: "Content-Type",
                        value: "text/html",
                      },
                    ],
                  },
                  body: "<!doctype html><p>Loading...</p>",
                }; */
                },
              }
            );
            console.log("await writable on finish");
            await new Promise((resolve, reject) => {
              writable.on("finish", resolve);
              console.log("finished");
            });

            /*writable.on("finish", () => {*/
            const html = writable.getHtml();
            console.log("writable on finish");
            console.log(html);
            let indexHTML = data
              .toString()
              .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
            const subdomain = host?.split(".")[0];
            console.log(subdomain);
            if (subdomain === "jet") {
              const newTitle = "Barbería Jet - Agendá tu turno";
              const newDescription = "Agendá turno en Barbería Jet Uruguay";
              const newContent = "<p>Barbería Jet</p><br />";
              indexHTML = indexHTML
                .replace(/<title>.*<\/title>/, `<title>${newTitle}</title>`)
                .replace(
                  /<meta\s+name="description".*?\/>\s*/,
                  `<meta name="description" content="${newDescription}/>`
                )
                .replace(
                  '<div id="content"></div>',
                  `<div id="content">${newContent}</div>`
                );
            }

            console.log("html");
            console.log(indexHTML);
            return {
              status: "200",
              statusDescription: "OK",
              headers: {
                "cache-control": [
                  {
                    key: "Cache-Control",
                    value: "no-cache",
                  },
                ],
                "content-type": [
                  {
                    key: "Content-Type",
                    value: "text/html",
                  },
                ],
              },
              body: indexHTML,
            };
          } else {
            return {
              status: "200",
              statusDescription: "OK",
              headers: {
                "cache-control": [
                  {
                    key: "Cache-Control",
                    value: "no-cache",
                  },
                ],
                "content-type": [
                  {
                    key: "Content-Type",
                    value: "text/html",
                  },
                ],
              },
              body: data,
            };
          }
          /* responseStream.setContentType("application/json");
          responseStream.write(response);
          responseStream.end(); */
          /*responseStream.end(response);*/

          /*responseStream.setContentType("text/html");
        responseStream.write(indexHTML);
        responseStream.end();*/
          /*});*/
          /* } else {
            const key = request.uri.startsWith("/")
              ? request.uri.replace("/", "")
              : request.uri;
            const params = {
              Bucket: "barberuy-s3-dev-ui",
              Key: key,
            };

            console.log(key);
            const s3Stream = s3.getObject(params).createReadStream();
            responseStream.setContentType("image/png");
            /* responseStream.setHeader("Content-Type", "image/png");
        responseStream.setHeader(
          "Content-Disposition",
          'inline; filename="logo.png"'
        ); */

          /*s3Stream.pipe(responseStream);
            /* const s3Object = await s3.getObject(params).promise();
        const data = s3Object.Body?.toString() || "";

        const response = {
          status: "200",
          statusDescription: "OK",
          body: data,
        };
        responseStream.setContentType("application/json");
        responseStream.write(response);
        responseStream.end(); 
          } */
        } catch (error: any) {
          console.log(`Error ${error.message}`);
          /* return `Error ${error}`;*/
        }
      };
    console.log("calling stream");
    return await stream(request, response);
  } catch (error: any) {
    console.log("error in streamify response");
    console.log(error);
  }
};

export { handler };

/*import React from "react";
import ReactDOMServer from "react-dom/server";
import { Writable } from "stream";
import { StaticRouter } from "react-router-dom/server";
import App from "../src/App.tsx";

class HtmlWritable extends Writable {
  chunks: any[] = [];
  html = "";

  getHtml() {
    return this.html;
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }

  _final(callback) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}

const BASE_HOST = ".barber.uy";

function getSubdomain(host) {
  return host.substring(0, host.length - BASE_HOST.length);
}

const indexFile = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="meta-description-content"
    />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>meta-title</title>
    <script defer="defer" src="/static/js/main.ce2b93fd.js"></script>
    <link href="/static/css/main.60a6e02d.css" rel="stylesheet" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

const writable = new HtmlWritable();
const handler = async function (event) {
  try {
    const request = event.Records[0].cf.request;

    // Extract the URI from the request
    const olduri = request.uri;

    const subdomain = getSubdomain(request.headers.host[0].value);

    /*if(subdomain) {
      
      const newuri = `/${subdomain}.html`;
      request.uri = newuri;
    }

    if (subdomain !== "www" && request.uri === "/edgessr") {
      //const url = config.SSRApiStack.apiurl;
      let body, statusCode;
      //const result = await axios.get(url);
      /*fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
        if (err) {
          console.error(err);
          statusCode = 500;
          body = "<!doctype html><p>Could not render the app server-side</p>";
          return {
            status: statusCode,
            statusDescription: "OK",
            headers: {
              "cache-control": [
                {
                  key: "Cache-Control",
                  value: "max-age=100",
                },
              ],
              "content-type": [
                {
                  key: "Content-Type",
                  value: "text/html",
                },
              ],
            },
            body: body,
          };
        }

      const entryPoint = ["/main.js"];

      const { pipe, abort: _abort } = ReactDOMServer.renderToPipeableStream(
        <StaticRouter location={request.uri}>
          <App />
        </StaticRouter>,
        {
          bootstrapScripts: entryPoint,
          onShellReady() {
            pipe(writable);
          },
          onShellError() {
            return {
              status: 500,
              statusDescription: "OK",
              headers: {
                "cache-control": [
                  {
                    key: "Cache-Control",
                    value: "max-age=100",
                  },
                ],
                "content-type": [
                  {
                    key: "Content-Type",
                    value: "text/html",
                  },
                ],
              },
              body: "<!doctype html><p>Loading...</p>",
            };
          },
        }
      );

      writable.on("finish", () => {
        const html = writable.getHtml();
        const subdomainTitle =
          subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
        body = indexFile
          .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
          .replace(
            "meta-description-content",
            `Agendá tu turno en la barbería ${subdomainTitle}`
          )
          .replace("meta-title", `Barbería ${subdomainTitle} - Agenda online`);
        return {
          status: "200",
          statusDescription: "OK",
          headers: {
            "cache-control": [
              {
                key: "Cache-Control",
                value: "max-age=100",
              },
            ],
            "content-type": [
              {
                key: "Content-Type",
                value: "text/html",
              },
            ],
          },
          body: body,
        };
      });
      /*});*/

/*const app = ReactDOMServer.renderToString(<SSRApp data={result.data} />);
      const html = indexFile.replace(
        '<div id="root"></div>',
        `<div id="root">${app}</div>`
      );
      return {
        status: "200",
        statusDescription: "OK",
        headers: {
          "cache-control": [
            {
              key: "Cache-Control",
              value: "max-age=100",
            },
          ],
          "content-type": [
            {
              key: "Content-Type",
              value: "text/html",
            },
          ],
        },
        body: html,
      };
    } else {
      return request;
    }
  } catch (error) {
    console.log(`Error ${error.message}`);
    return `Error ${error}`;
  }
};

export { handler }; 

*/
