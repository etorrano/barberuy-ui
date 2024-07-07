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
  StaticRouterProvider,
} from "react-router-dom/server";
import { URL } from "url";
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
const router = express.Router();

const processRequest = async (req: any, res: any, next: any) => {
  console.log(req.url);
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let fetchRequest = createFetchRequest(
    parsedUrl.pathname,
    req.headers,
    req.method,
    req.body,
    res,
    req.get("host")
  );
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
          console.log("html");
          console.log(html);
          const indexHTML = data
            .toString()
            .replace(
              "<script>window.__SSR_DISABLED__ = true;</script>",
              "<script>window.__SSR_DISABLED__ = false;</script>"
            )
            .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
          //.replaceAll('<img src="', '<img src="data:image/png;base64,');
          console.log(indexHTML);
          res.send(indexHTML); // In an express js context
        });
      }
    );
  }
};

const customMiddleware = (req, res, next) => {
  if (req.path === "/" || req.path === "/login") {
    console.log(`Middleware for ${req.path}`);
  }
  next();
};

app.use((req, res, next) => {
  console.log(`Request path: ${req.path}`);
  next();
});
//app.use(express.static(path.resolve(__dirname, ".")));
// This does the server-side rendering on the '/' route, works because we are a single page app
/* app.get("/", (req, res) => {
  res.send("Root Path Processed");
}); */

router.use(customMiddleware);

// Define routes in the router
router.get("/", processRequest);

router.get("/login", processRequest);
/* router.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
}); */

// Use the router for root paths
app.use("/", router);
app.use(express.static(path.resolve(__dirname, "../build")));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
