const express = require("express");
const fs = require("fs");
const app = express();

const index = require("./public/index.js");

const PORT = 3000;

app.get("/", (req, res) => {
  // I'm lost

  const shapeCode = Object.keys(req.query)[0]?.replace(/\./gi, ":");

  let image = "logo.png";

  let layers = null;
  let canvas = null;
  let imageURL = null;
  let error = null;
  let lError = null;

  if (shapeCode) {
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
  htmlString = htmlString
    .replace("{{TITLE}}", shapeCode || "Shape Generator")
    .replace("{{IMAGEDATA}}", image || "logo.png")
    .replace("{{DESCRIPTION}}", lError ? `Error: ${lError}` : "");

  res.send(htmlString);
});

app.use(express.static("./public"));

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on port ${PORT}`);
});
