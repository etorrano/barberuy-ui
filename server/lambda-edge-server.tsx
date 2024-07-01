import AWS from "aws-sdk";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import { Writable } from "stream";
import App from "../src/App";
import { routes } from "../src/routes"; // @ts-ignore
import createFetchRequest from "./request";

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

// @ts-ignore
const handler = awslambda.streamifyResponse(
  async (event: any, responseStream: any) => {
    const writable = new HtmlWritable();
    //const handler = async function (event: any) {
    try {
      const request = event.Records[0].cf.request;
      const s3 = new AWS.S3();
      if (["/", "/index.html", "/login", "login"].indexOf(request.uri) !== -1) {
        const params = {
          Bucket: "barberuy-s3-dev-ui",
          Key: "index.html",
        };
        const s3Object = await s3.getObject(params).promise();
        const data = s3Object.Body?.toString() || "";
        console.log(data);
        let url = request.uri === "/index.html" ? "" : request.uri;
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
        console.log("await writable on finish");
        await new Promise((resolve, reject) => {
          writable.on("finish", resolve);
          console.log("finished");
        });

        /*writable.on("finish", () => {*/
        const html = writable.getHtml();
        console.log("writable on finish");
        console.log(html);
        const indexHTML = data
          .toString()
          .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
        console.log("html");
        console.log(indexHTML);
        const response = {
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
        responseStream.setContentType("application/json");
        responseStream.write(response);
        responseStream.end();
        /*responseStream.end(response);*/

        /*responseStream.setContentType("text/html");
        responseStream.write(indexHTML);
        responseStream.end();*/
        /*});*/
      } else {
        return request;
        /* const key =
          request.uri.split("/").length > 1
            ? request.uri
            : request.uri.replace("/", "");
        const params = {
          Bucket: "barberuy-s3-dev-ui",
          Key: key,
        };

        console.log(key);
        const s3Object = await s3.getObject(params).promise();
        const data = s3Object.Body?.toString() || "";
        const response = {
          status: "200",
          statusDescription: "OK",
          body: data,
        };
        responseStream.write(response);
        responseStream.end(); */
      }
    } catch (error: any) {
      console.log(`Error ${error.message}`);
      return `Error ${error}`;
    }
  }
);

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
