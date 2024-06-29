export default function createFetchRequest(
  reqUri: string,
  reqHeaders: any,
  reqMethod: string,
  reqBody: any,
  res: any
) {
  //let origin = `${req.protocol}://${req.get("host")}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL("https://www.barber.uy" + reqUri);
  console.log(url);

  let controller = new AbortController();
  res.on("close", () => controller.abort());

  let headers = new Headers();

  for (let [key, values] of Object.entries(reqHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values as string);
      }
    }
  }

  let init = {
    method: reqMethod,
    headers,
    signal: controller.signal,
  };

  if (reqMethod !== "GET" && reqMethod !== "HEAD") {
    init["body"] = reqBody;
  }

  return new Request(url.href, init);
}
