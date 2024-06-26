import AWS from "aws-sdk";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Writable } from "stream";

class HtmlWritable extends Writable {
  chunks: any[] = [];
  html = "";

  getHtml() {
    return this.html;
  }

  _write(chunk: any, encoding: any, callback: any) {
    this.chunks.push(chunk);
    callback();
  }

  _final(callback: any) {
    this.html = Buffer.concat(this.chunks).toString();
    callback();
  }
}
const writable = new HtmlWritable();

const handler = async function (event: any) {
  try {
    const s3 = new AWS.S3();
    const params = { Bucket: "barberuy-s3-dev-ui", Key: "index.html" };
    const s3Object = await s3.getObject(params).promise();
    const data = s3Object.Body?.toString() || "";
    console.log(data);
    const { pipe } = ReactDOMServer.renderToPipeableStream(
      <React.StrictMode>
        <StaticRouter location={event.rawPath} />
      </React.StrictMode>,
      {
        onShellReady() {
          pipe(writable);
        },
        onShellError() {
          return {
            statusCode: 500,
            headers: { "Content-Type": "text/html" },
            body: "<!doctype html><p>Loading...</p>",
          };
        },
      }
    );

    await new Promise((resolve, reject) => {
      writable.on("finish", resolve);
    });

    const html = writable.getHtml();
    const indexHTML = data
      .toString()
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: indexHTML,
    };
  } catch (error: any) {
    console.log(`Error ${error.message}`);
    return `Error ${error}`;
  }
};

export { handler };
