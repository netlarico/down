import express from "express";
import { spawn } from "child_process";
import fs from "fs";

const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.get("/extract", (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).send("Missing URL");

  const id = Date.now();
  const file = `${id}.m4a`;

  const proc = spawn("yt-dlp", [
    "-f", "bestaudio",
    "--no-playlist",
    "-o", file,
    url
  ]);

  proc.on("close", () => {
    if (!fs.existsSync(file)) return res.status(500).send("Failed");

    res.setHeader("Content-Type", "audio/mp4");
    const stream = fs.createReadStream(file);
    stream.pipe(res);

    stream.on("end", () => fs.unlinkSync(file));
  });

  proc.on("error", () => {
    res.status(500).send("Error");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("running on", PORT);
});
