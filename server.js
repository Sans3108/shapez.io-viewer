const express = require("express");
const path = require("path");

const index = require("./public/index.js");

const app = express();

app.set("view engine", "ejs");

const PORT = 3000;

app.get("/", async (req, res) => {
  const code = Object.keys(req.query)[0]?.replace(/\./gi, ":");

  const imageURL = code
    ? `https://shapez.sans-stuff.xyz/image/?code=${code}`
    : "https://shapez.sans-stuff.xyz/logo.png";

  const url = `https://shapez.sans-stuff.xyz/${code ? `?${code}` : ""}`;

  res.render("index", { imageURL: imageURL, url: url, color: "#66a7ff" });
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
