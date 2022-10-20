const express = require("express");
const fs = require("fs");
const app = express();

const index = require("./index.js");

const PORT = 3000;

app.get("/", (req, res) => {
  // I'm lost

  const shape = Object.keys(req.query)[0];

  let layers = null;
  try {
    layers = index.fromShortKey(shape);
  } catch (err) {
    layers = err.message;
  }

  console.log(layers);

  let htmlString = fs.readFileSync("./index.html", {
    encoding: "utf8",
    flag: "r",
  });
  htmlString = htmlString
    .replace("{{TITLE}}", shape)
    .replace("{{IMAGEDATA}}", "test")
    .replace("{{DESCRIPTION}}", typeof layers === 'string' ? `Error: ${layers}` : '');

  res.send(htmlString);
});

app.use(express.static("./"));

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on port ${PORT}`);
});
