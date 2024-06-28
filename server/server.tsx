import express from "express";
import fs from "fs";
import path from "path";
import { Writable } from "stream";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
// @ts-ignore
import App from "../src/App.tsx";
// @ts-ignore
import { routes } from "../src/routes.tsx"; // @ts-ignore
import createFetchRequest from "./request.ts";
class HtmlWritable extends Writable {
  chunks: any[] = [];
  html = "";

  getHtml() {
    return this.html;
  }

  reset() {
    this.chunks = [];
    this.html = "";
  }

  _write(chunk: any, encoding: any, callback: any) {
    console.log("writable");
    console.log(chunk);
    this.chunks.push(chunk);
    callback();
  }

  _final(callback: any) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}
let handler = createStaticHandler(routes);
const app = express();
const PORT = process.env.PORT || 3000;

// This does the server-side rendering on the '/' route, works because we are a single page app
app.use(
  ["^/$", "/index", "/index.html", "/login"],
  async (req: any, res: any, next: any) => {
    console.log(req.url);

    let fetchRequest = createFetchRequest(req, res);
    let context = await handler.query(fetchRequest);
    if (
      context instanceof Response &&
      [301, 302, 303, 307, 308].includes(context.status)
    ) {
      return res.redirect(context.status, context.headers.get("Location"));
    }

    if (!(context instanceof Response)) {
      const writable = new HtmlWritable();
      fs.readFile(
        path.resolve("./build/index.html"),
        "utf-8",
        (err: any, data: any) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Could not render the app server-side");
          }
          console.log("render");
          let router = createStaticRouter(
            handler.dataRoutes,
            context as StaticHandlerContext
          );
          console.log("create static router");
          const { pipe } = ReactDOMServer.renderToPipeableStream(
            /*   <StaticRouter location={req.url} >
              <App />
            </StaticRouter>, */
            <StaticRouterProvider
              router={router}
              context={context as StaticHandlerContext}
            />,
            {
              onShellReady() {
                console.log("on shell ready");
                res.statusCode = 200;
                res.setHeader("Content-type", "text/html");
                pipe(writable);
              },
              onShellError() {
                res.statusCode = 500;
                res.send("<!doctype html><p>Loading...</p>");
              },
            }
          );

          writable.on("finish", () => {
            const html = writable.getHtml();
            const indexHTML = data
              .toString()
              .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
            res.send(indexHTML); // In an express js context
          });
        }
      );
    }
  }
);
app.use(express.static(path.resolve(__dirname, "../build")));
app.listen(PORT, () => {
  console.log("App is running on http://localhost:" + PORT);
});
