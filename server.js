const express = require("express");
const https = require('https');
const fs = require("fs");
const app = express();

const key = fs.readFileSync('./cert/key.pem');
const cert = fs.readFileSync('./cert/cert.pem');

const options = {
  key: key,
  cert: cert
};

const index = require("./public/index.js");

const PORT = 80;

app.get("/", (req, res) => {
  // I'm lost

  const shapeCode = Object.keys(req.query)[0]?.replace(/\./gi, ":");

  let image = "logo.png";
  let url = "https://shapez.sans-stuff.xyz";

  let layers = null;
  let canvas = null;
  let imageURL = null;
  let error = null;
  let lError = null;

  if (shapeCode) {
    url = url + `/${shapeCode.replace(/:/gi, ".")}`;
    try {
      layers = index.fromShortKey(shapeCode);
    } catch (err) {
      error = err.message;
      lError = err.message;
    }
  }

  if (layers && !error) {
    try {
      canvas = index.renderShape(layers);
    } catch (err) {
      error = err.message;
    }
  }

  if (canvas && !error) {
    try {
      imageURL = index.exportShape(canvas);
    } catch (err) {
      error = err.message;
    }
  }

  if (imageURL && !error) {
    image = imageURL;
  }

  let htmlString = fs.readFileSync("./public/index.html", {
    encoding: "utf8",
    flag: "r",
  });

  // IMAGEDATA, TITLE, DESCRIPTION, URL
  htmlString = htmlString
    .replaceAll("{{TITLE}}", shapeCode || "Shape Generator")
    .replaceAll("{{IMAGEDATA}}", image || "logo.png")
    .replaceAll("{{DESCRIPTION}}", lError ? `Error: ${lError}` : "")
    .replaceAll("{{URL}}", url);

  res.send(htmlString);
});

app.use(express.static("./public"));

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});