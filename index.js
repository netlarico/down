import express from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// CORS para peticiones desde el frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/extract", (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL");
  }

  const id = Date.now();
  const output = `${id}.m4a`;

  const ytdlp = spawn("yt-dlp", [
    "-f",
    "bestaudio",
    "--no-playlist",
    "-o",
    output,
    url,
  ]);

  let error = "";

  ytdlp.stderr.on("data", (data) => {
    error += data.toString();
  });

  ytdlp.on("close", (code) => {
    if (code !== 0) {
      if (fs.existsSync(output)) {
        fs.unlinkSync(output);
      }
      return res.status(400).send("Error descargando el video. URL válida?");
    }

    if (!fs.existsSync(output)) {
      return res.status(500).send("Error al procesar el archivo");
    }

    res.setHeader("Content-Type", "audio/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="${id}.m4a"`);

    const stream = fs.createReadStream(output);
    stream.pipe(res);

    stream.on("end", () => {
      fs.unlinkSync(output);
    });

    stream.on("error", () => {
      if (fs.existsSync(output)) {
        fs.unlinkSync(output);
      }
    });
  });

  ytdlp.on("error", () => {
    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }
    res.status(500).send("Error al procesar");
  });
});

app.listen(3000, () => {
  console.log("🎵 Audio Downloader Server");
  console.log("📍 http://localhost:3000");
  console.log("✅ Servidor ejecutándose...");
});
