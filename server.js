const express = require("express");
const fs = require("fs");
const app = express();

//const index = require('./index.js');

const PORT = 3000;

app.get("/", (req, res) => {
  // I'm lost

  const shape = Object.keys(req.query)[0];

  let htmlString = fs.readFileSync("./index.html", {
    encoding: "utf8",
    flag: "r",
  });
  htmlString = htmlString
    .replace("{{TITLE}}", shape)
    .replace("{{IMAGEDATA}}", "test");

  res.send(htmlString);
});

app.use(express.static("./"));

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on port ${PORT}`);
});
