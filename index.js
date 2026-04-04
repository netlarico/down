import express from "express";
import { spawn } from "child_process";
import fs from "fs";

const app = express();

app.get("/extract", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL");
  }

  const id = Date.now();
  const output = `${id}.m4a`;

  const ytdlp = spawn("yt-dlp", [
    "-f", "bestaudio",
    "--no-playlist",
    "-o", output,
    url
  ]);

  ytdlp.on("close", () => {
    if (!fs.existsSync(output)) {
      return res.status(500).send("Failed");
    }

    res.setHeader("Content-Type", "audio/mp4");

    const stream = fs.createReadStream(output);
    stream.pipe(res);

    stream.on("end", () => {
      fs.unlinkSync(output);
    });
  });

  ytdlp.on("error", () => {
    res.status(500).send("Error");
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
