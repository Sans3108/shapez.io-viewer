const express = require("express");
const fs = require("fs");

const app = express();

const index = require("./public/index.js");

const PORT = 3000;

app.get("/", async (req, res) => {
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
      imageURL = `https://shapez.sans-stuff.xyz/image/?data=${encodeURIComponent(
        index.exportShape(canvas)
      )}`;

      //console.log(imageURL);
    } catch (err) {
      error = err.message;
    }
  }

  if (error) console.error(error);

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
    .replaceAll(
      "{{IMAGEDATA}}",
      image || "https://shapez.sans-stuff.xyz/logo.png"
    )
    .replaceAll("{{DESCRIPTION}}", lError ? `Error: ${lError}` : "")
    .replaceAll("{{URL}}", url);

  res.send(htmlString);
});

// app.get("/image", (req, res) => {

//   try {
//     const file = Buffer.from(req.query.data.split(",")[1], "base64");
//     res.writeHead(200, { "Content-Length": file.length }).end(file);
//   } catch (e) {
//     return;
//   }
// });

app.get("/image", function (req, res) {
  let img = Buffer.from(req.query.data.split(",")[1], "base64");
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": img.length,
  });
  res.end(img);
});

app.use(express.static("./public"));

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server listening on port ${PORT}`);
});
