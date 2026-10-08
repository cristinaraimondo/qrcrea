const { execFile } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const ffmpegPath = require("ffmpeg-static");
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
app.use(cors({
  origin: [
    "https://qrcrea.com.ar",
    "https://www.qrcrea.com.ar"
  ]
}));
app.use(express.json({ limit: "30mb" }));
const os = require("node:os");

const crearCarpetaTemporal = () => {
  return fs.mkdtempSync(path.join(os.tmpdir(), "qrcrea-video-"));
};

app.get("/", (req, res) => {
  res.send("Servidor de videos QRcrea funcionando");
});

const PORT = process.env.PORT || 3000;
const limitarVideos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Alcanzaste el límite de 3 videos. Intentá nuevamente en 15 minutos."
  }
});
let videoEnProceso = false;
app.post("/generar-video", limitarVideos, async (req, res) => {
  const { imagen, musica } = req.body;
  let urlMusica;

try {
  urlMusica = new URL(musica);

  if (
    urlMusica.protocol !== "https:" ||
    urlMusica.hostname !== "srottoudvavudcujvzeb.supabase.co" ||
    !urlMusica.pathname.startsWith("/storage/v1/object/sign/user-files/")
  ) {
    throw new Error("URL no permitida");
  }
} catch {
  return res.status(400).json({
    error: "La dirección de la música no es válida"
  });
}

  if (!imagen || !musica) {
    return res.status(400).json({
      error: "Falta la imagen o la música"
    });
  }

if (videoEnProceso) {
  return res.status(503).json({
    error: "Estamos generando otra tarjeta. Intentá nuevamente en unos minutos."
  });
}

videoEnProceso = true;

const carpeta = crearCarpetaTemporal();
  const archivoImagen = path.join(carpeta, "tarjeta.png");
  const archivoMusica = path.join(carpeta, "musica.mp3");
  const archivoVideo = path.join(carpeta, "tarjeta.mp4");

  try {
    const imagenBase64 = imagen.replace(
      /^data:image\/png;base64,/,
      ""
    );

   const lector = respuestaMusica.body.getReader();
const fragmentos = [];
let totalBytes = 0;

try {
  while (true) {
    const { done, value } = await lector.read();
    if (done) break;

    totalBytes += value.byteLength;

    if (totalBytes > tamañoMaximo) {
      await lector.cancel();
      throw new Error("La música supera los 15 MB permitidos");
    }

    fragmentos.push(Buffer.from(value));
  }
} finally {
  lector.releaseLock();
}

fs.writeFileSync(archivoMusica, Buffer.concat(fragmentos));

    const respuestaMusica = await fetch(musica);
    const tamañoMaximo = 15 * 1024 * 1024; // 15 MB

const tamañoDeclarado = Number(
  respuestaMusica.headers.get("content-length")
);

if (
  Number.isFinite(tamañoDeclarado) &&
  tamañoDeclarado > tamañoMaximo
) {
  throw new Error("La música supera los 15 MB permitidos");
}

    if (!respuestaMusica.ok) {
      throw new Error("No se pudo descargar la música");
    }

    fs.writeFileSync(
      archivoMusica,
      Buffer.from(await respuestaMusica.arrayBuffer())
    );

    const argumentos = [
      "-y",
      "-loop", "1",
      "-framerate", "30",
      "-i", archivoImagen,
      "-i", archivoMusica,
      "-shortest",
      "-t", "300",
      "-vf", [
        "scale=1080:1920:force_original_aspect_ratio=decrease",
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:white",

        ...Array.from({ length: 65 }, (_, i) => {
          const colores = ["yellow", "magenta", "cyan", "orange", "lime", "pink"];
          const color = colores[i % colores.length];
          const x = (i * 173) % 1050;
          const y = (i * 97) % 1920;
          const velocidad = 90 + (i % 7) * 25;
          const amplitud = 25 + (i % 5) * 12;
          const tamaño = 12 + (i % 4) * 5;

          return `drawtext=text='■':fontcolor=${color}:fontsize=${tamaño}:x=${x}+${amplitud}*sin(t*2+${i}):y=mod(t*${velocidad}+${y}\\,1920)`;
        })
      ].join(","),
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "192k",
      "-movflags", "+faststart",
      archivoVideo
    ];

    await new Promise((resolve, reject) => {
      execFile(ffmpegPath, argumentos, { maxBuffer: 10 * 1024 * 1024 }, error => {
        if (error) reject(error);
        else resolve();
      });
    });

    res.download(archivoVideo, "tarjeta-qrcrea.mp4", () => {
      fs.rmSync(carpeta, { recursive: true, force: true });
    });

  } catch (error) {
  console.error(error);
  videoEnProceso = false;
  fs.rmSync(carpeta, { recursive: true, force: true });
  res.status(500).json({
    error: "No se pudo generar el video"
  });
}
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor QRcrea iniciado en puerto ${PORT}`);
});