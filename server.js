const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const index = require("./public/index.js");

const PORT = 3000;

app.get("/", async (req, res) => {
  const shapeCode = Object.keys(req.query)[0]?.replace(/\./gi, ":");

  const imageURL = `https://shapez.sans-stuff.xyz/image/?code=${shapeCode}`;

  const url =
    "https://shapez.sans-stuff.xyz/" + (shapeCode ? `?${shapeCode}` : "");

  let htmlString = fs.readFileSync("./public/index.html", {
    encoding: "utf8",
    flag: "r",
  });

  // IMAGEDATA, TITLE, DESCRIPTION, URL
  htmlString = htmlString
    .replaceAll("{{TITLE}}", shapeCode || "Shape Generator")
    .replaceAll(
      "{{IMAGEDATA}}",
      shapeCode ? imageURL : "https://shapez.sans-stuff.xyz/logo.png"
    )
    .replaceAll("{{URL}}", url);

  res.send(htmlString);
});

// I coulda done this better tbh
app.get("/image", (req, res) => {
  const shapeCode = req.query.code?.replace(/\./gi, ":");

  let file;
  let err;

  try {
    file = Buffer.from(
      index.exportShape(index.renderShape(index.fromShortKey(shapeCode))),
      "base64"
    );
  } catch (e) {
    err = e;
  }

  res.contentType("png");

  if (err) {
    console.error(err);
    return res.sendFile(path.join(__dirname, "./public", "n.png"));
  }
  res.writeHead(200, { "Content-Length": file.length }).end(file);
});

app.use(express.static("./public"));

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on port ${PORT}`);
});
