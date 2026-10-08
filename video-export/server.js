
const { execFile } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const dns = require("node:dns").promises;
const ffmpegPath = process.env.RENDER
  ? "ffmpeg"
  : require("ffmpeg-static");
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_HOST = "srottoudvavudcujvzeb.supabase.co";
const MAX_MUSICA = 15 * 1024 * 1024;
const MAX_IMAGEN = 10 * 1024 * 1024;

app.use(cors({
  origin: [
    "https://qrcrea.com.ar",
    "https://www.qrcrea.com.ar"
  ]
}));

app.use(express.json({ limit: "15mb" }));

app.get("/", (req, res) => {
  res.send("Servidor de videos QRcrea funcionando");
});

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

function crearCarpetaTemporal() {
  return fs.mkdtempSync(
    path.join(os.tmpdir(), "qrcrea-video-")
  );
}

function borrarCarpeta(carpeta) {
  if (carpeta) {
    fs.rmSync(carpeta, {
      recursive: true,
      force: true
    });
  }
}

function validarURLMusica(musica) {
  if (typeof musica !== "string") {
    throw new Error("La dirección de la música no es válida");
  }

  const url = new URL(musica);

  if (
    url.protocol !== "https:" ||
    url.hostname !== SUPABASE_HOST ||
    url.port !== "" ||
    !url.pathname.startsWith(
      "/storage/v1/object/sign/user-files/"
    )
  ) {
    throw new Error("La dirección de la música no está permitida");
  }

  return url;
}

async function descargarMusica(url, archivo) {
  const respuesta = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(30000)
  });
  console.log("Estado de descarga:", respuesta.status);
console.log("Error de Supabase:", await respuesta.clone().text().then(t => t.slice(0, 300)).catch(() => "No disponible"));

  if (!respuesta.ok || !respuesta.body) {
    throw new Error("No se pudo descargar la música");
  }

  const tamañoDeclarado = Number(
    respuesta.headers.get("content-length") || 0
  );

  if (tamañoDeclarado > MAX_MUSICA) {
    await respuesta.body.cancel();
    throw new Error("La música supera los 15 MB");
  }

  const lector = respuesta.body.getReader();
  const fragmentos = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await lector.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_MUSICA) {
        await lector.cancel();
        throw new Error("La música supera los 15 MB");
      }

      fragmentos.push(Buffer.from(value));
    }
  } finally {
    lector.releaseLock();
  }

  fs.writeFileSync(
    archivo,
    Buffer.concat(fragmentos)
  );
}

function generarArgumentos(imagen, musica, salida) {
  const colores = [
    "yellow",
    "magenta",
    "cyan",
    "orange",
    "lime",
    "pink"
  ];

 const filtros = [
  "scale=1080:1920:force_original_aspect_ratio=decrease",
  "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:white"
];

  for (let i = 0; i < 65; i++) {
    const color = colores[i % colores.length];
    const x = (i * 173) % 1050;
    const y = (i * 97) % 1920;
    const velocidad = 90 + (i % 7) * 25;
    const amplitud = 25 + (i % 5) * 12;
    const tamaño = 12 + (i % 4) * 5;

    filtros.push(
      `drawtext=text='■':fontcolor=${color}:fontsize=${tamaño}:x=${x}+${amplitud}*sin(t*2+${i}):y=mod(t*${velocidad}+${y}\\,1920)`
    );
  }

  return [
    "-y",
    "-loop", "1",
    "-framerate", "10",
    "-i", imagen,
    "-i", musica,
    "-shortest",
    "-t", "300",
    "-vf", filtros.join(","),
    "-c:v", "libx264",
  "-preset", "ultrafast",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    salida
  ];
}

app.post(
  "/generar-video",
  limitarVideos,
  async (req, res) => {
    const { imagen, musica } = req.body || {};

    if (!imagen || !musica) {
      return res.status(400).json({
        error: "Falta la imagen o la música"
      });
    }

    let urlMusica;

    try {
      urlMusica = validarURLMusica(musica);
    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    if (videoEnProceso) {
      return res.status(503).json({
        error: "Estamos generando otra tarjeta. Intentá nuevamente en unos minutos."
      });
    }

    videoEnProceso = true;
    let carpeta = null;

    try {
      if (
        typeof imagen !== "string" ||
        !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(imagen)
      ) {
        throw new Error("La imagen debe ser un PNG en Base64");
      }

      const imagenBase64 = imagen.substring(
        "data:image/png;base64,".length
      );

      const bufferImagen = Buffer.from(
        imagenBase64,
        "base64"
      );

      const firmaPNG = Buffer.from([
        137, 80, 78, 71, 13, 10, 26, 10
      ]);

      if (
        bufferImagen.length < 24 ||
        bufferImagen.length > MAX_IMAGEN ||
        !bufferImagen.subarray(0, 8).equals(firmaPNG)
      ) {
        throw new Error("La imagen PNG no es válida o supera los 10 MB");
      }

      carpeta = crearCarpetaTemporal();

      const archivoImagen = path.join(
        carpeta,
        "tarjeta.png"
      );

      const archivoMusica = path.join(
        carpeta,
        "musica.mp3"
      );

      const archivoVideo = path.join(
        carpeta,
        "tarjeta.mp4"
      );

      fs.writeFileSync(
        archivoImagen,
        bufferImagen
      );

      await descargarMusica(
        urlMusica.toString(),
        archivoMusica
      );

      const argumentos = generarArgumentos(
        archivoImagen,
        archivoMusica,
        archivoVideo
      );

      await new Promise((resolve, reject) => {
        execFile(
          ffmpegPath,
          argumentos,
          {
            maxBuffer: 10 * 1024 * 1024,
            timeout: 10 * 60 * 1000,
            killSignal: "SIGKILL"
          },
          error => {
            if (error) reject(error);
            else resolve();
          }
        );
      });

      res.download(
        archivoVideo,
        "tarjeta-qrcrea.mp4",
        error => {
          if (error) {
            console.error(
              "Error al enviar el video:",
              error.message
            );
          }

          borrarCarpeta(carpeta);
          videoEnProceso = false;
        }
      );

    } catch (error) {
      console.error(
        "Error generando video:",
        error
      );

      borrarCarpeta(carpeta);
      videoEnProceso = false;

      if (!res.headersSent) {
        res.status(500).json({
          error: "No se pudo generar el video"
        });
      }
    }
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Servidor QRcrea iniciado en puerto ${PORT}`
  );
});
