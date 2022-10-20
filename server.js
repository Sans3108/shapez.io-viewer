const express = require("express");
const fs = require("fs");
const app = express();

const index = require('./index.js');

const PORT = 3000;

app.get("/", (req, res) => {
  // I'm lost

  console.log(Object.keys(req.query)[0]);

  let htmlString = fs.readFileSync("./index.html", {
    encoding: "utf8",
    flag: "r",
  });
  htmlString.replace("{{TITLE}}", req.query.title);
  htmlString.replace("{{IMAGEDATA}}", req.query.image);

  res.send(htmlString);
});

app.use(express.static("./"));

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on port ${PORT}`);
});
