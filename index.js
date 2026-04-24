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

// Función para obtener información del archivo (duración, bitrate)
function getAudioInfo(filePath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration,bit_rate",
      "-of",
      "default=noprint_wrappers=1",
      filePath,
    ]);

    let output = "";

    ffprobe.stdout.on("data", (data) => {
      output += data.toString();
    });

    ffprobe.on("close", (code) => {
      if (code !== 0) {
        resolve({ duration: null, bitrate: null });
        return;
      }

      try {
        const lines = output.trim().split("\n");
        let duration = null;
        let bitrate = null;

        for (const line of lines) {
          if (line.startsWith("duration=")) {
            const durationSeconds = parseFloat(line.split("=")[1]);
            if (!isNaN(durationSeconds)) {
              const mins = Math.floor(durationSeconds / 60);
              const secs = Math.floor(durationSeconds % 60);
              duration = `${mins}:${secs.toString().padStart(2, "0")}`;
            }
          }
          if (line.startsWith("bit_rate=")) {
            const bitrateValue = parseInt(line.split("=")[1]);
            if (!isNaN(bitrateValue)) {
              bitrate = Math.round(bitrateValue / 1000) + " kbps";
            }
          }
        }

        resolve({ duration, bitrate });
      } catch (err) {
        resolve({ duration: null, bitrate: null });
      }
    });

    ffprobe.on("error", () => {
      resolve({ duration: null, bitrate: null });
    });
  });
}

// Función para ejecutar ffmpeg
function runFfmpeg(inputFile, outputFile, metadata) {
  return new Promise((resolve, reject) => {
    const args = ["-i", inputFile, "-vn"];

    if (metadata.title) {
      args.push("-metadata", `title=${metadata.title}`);
    }
    if (metadata.artist) {
      args.push("-metadata", `artist=${metadata.artist}`);
    }

    args.push("-acodec", "copy", "-y", outputFile);

    const ffmpeg = spawn("ffmpeg", args);
    let error = "";

    ffmpeg.stderr.on("data", (data) => {
      error += data.toString();
    });

    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`FFmpeg error: ${error}`));
      } else {
        resolve();
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
}

// Platform detection helper
function detectPlatform(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    } else if (hostname.includes('instagram.com')) {
      return 'Instagram';
    } else if (hostname.includes('tiktok.com') || hostname.includes('tiktokcdn.com')) {
      return 'TikTok';
    } else if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
      return 'Facebook';
    } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'Twitter/X';
    } else if (hostname.includes('reddit.com')) {
      return 'Reddit';
    } else if (hostname.includes('vimeo.com')) {
      return 'Vimeo';
    } else if (hostname.includes('twitch.tv')) {
      return 'Twitch';
    } else if (hostname.includes('soundcloud.com')) {
      return 'SoundCloud';
    }
    return 'Unknown';
  } catch (e) {
    return 'Invalid';
  }
}

app.get("/extract", (req, res) => {
  const { url, title, artist } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL");
  }

  const platform = detectPlatform(url);
  console.log(`🎵 Download request from platform: ${platform}`);
  console.log(`🔗 URL: ${url}`);

  const id = Date.now();
  const output = `${id}.m4a`;
  const outputWithMetadata = `${id}_meta.m4a`;

  // Generar nombre del archivo personalizado
  let filename = `${id}.m4a`;
  if (title || artist) {
    let name = "";
    if (title) name += title.trim();
    if (title && artist) name += " - ";
    if (artist) name += artist.trim();

    // Limpiar caracteres inválidos para nombres de archivo
    name = name.replace(/[/\\?%*:|"<>]/g, "");
    filename = `${name}.m4a`;
  }

  const ytdlp = spawn("yt-dlp", [
    "-f",
    "bestaudio/best",
    "--audio-format",
    "m4a",
    "--no-playlist",
    "--quiet",
    "--no-warnings",
    "-o",
    output,
    url,
  ]);

  let error = "";

  ytdlp.stderr.on("data", (data) => {
    error += data.toString();
  });

  ytdlp.on("close", async (code) => {
    if (code !== 0) {
      if (fs.existsSync(output)) {
        fs.unlinkSync(output);
      }
      console.error(`yt-dlp error for ${platform}:`, error);
      
      // Platform-specific error messages
      let errorMessage = "Error descargando. Verifica que la URL sea válida y que el video sea público.";
      
      if (platform === 'Instagram') {
        errorMessage = "Error descargando de Instagram. Asegúrate de que el post sea público y no sea una historia privada.";
      } else if (platform === 'TikTok') {
        errorMessage = "Error descargando de TikTok. Verifica que el video sea público y la URL sea correcta.";
      } else if (platform === 'YouTube') {
        errorMessage = "Error descargando de YouTube. Verifica que el video no sea privado o restringido por edad.";
      } else if (platform === 'Facebook') {
        errorMessage = "Error descargando de Facebook. Asegúrate de que el video sea público.";
      } else if (platform === 'Twitter/X') {
        errorMessage = "Error descargando de Twitter/X. Verifica que el tweet sea público.";
      }
      
      return res.status(400).send(errorMessage);
    }

    if (!fs.existsSync(output)) {
      console.error(`Output file not found for ${platform}`);
      return res.status(500).send("Error al procesar el archivo");
    }

    console.log(`✅ Successfully downloaded from ${platform}`);

    try {
      // Si hay metadata, usar ffmpeg para agregarla
      if (title || artist) {
        await runFfmpeg(output, outputWithMetadata, { title, artist });
        fs.unlinkSync(output);

        // Obtener información del archivo
        const info = await getAudioInfo(outputWithMetadata);

        res.setHeader("Content-Type", "audio/mp4");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`,
        );
        if (info.duration) {
          res.setHeader("X-Duration", info.duration);
        }
        if (info.bitrate) {
          res.setHeader("X-Bitrate", info.bitrate);
        }

        const stream = fs.createReadStream(outputWithMetadata);
        stream.pipe(res);

        stream.on("end", () => {
          fs.unlinkSync(outputWithMetadata);
        });

        stream.on("error", () => {
          if (fs.existsSync(outputWithMetadata)) {
            fs.unlinkSync(outputWithMetadata);
          }
        });
      } else {
        // Sin metadata, servir directamente
        // Obtener información del archivo
        const info = await getAudioInfo(output);

        res.setHeader("Content-Type", "audio/mp4");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`,
        );
        if (info.duration) {
          res.setHeader("X-Duration", info.duration);
        }
        if (info.bitrate) {
          res.setHeader("X-Bitrate", info.bitrate);
        }

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
      }
    } catch (err) {
      console.error("Error procesando archivo:", err);
      if (fs.existsSync(output)) {
        fs.unlinkSync(output);
      }
      if (fs.existsSync(outputWithMetadata)) {
        fs.unlinkSync(outputWithMetadata);
      }
      res.status(500).send("Error al procesar el archivo");
    }
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
