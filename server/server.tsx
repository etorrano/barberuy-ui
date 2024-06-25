import express from "express";
import fs from "fs";
import path from "path";
import { Writable } from "stream";
import React from "react";
import ReactDOMServer from "react-dom/server";
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

const app = express();
const PORT = process.env.PORT || 3000;
const writable = new HtmlWritable();

app.use(express.static(path.resolve(__dirname, "../build")));

// This does the server-side rendering on the '/' route, works because we are a single page app
app.use("/*", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Could not render the app server-side");
    }

    const entryPoint = ["/main.js"];

    const { pipe, abort: _abort } = ReactDOMServer.renderToPipeableStream(
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>,
      {
        bootstrapScripts: entryPoint,
        onShellReady() {
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
  });
});

app.listen(PORT, () => {
  console.log("App is running on http://localhost:" + PORT);
});
