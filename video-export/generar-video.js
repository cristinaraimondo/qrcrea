const { execFile } = require("node:child_process");
const path = require("node:path");

const salida = path.join(__dirname, "prueba.mp4");

const argumentos = [
  "-y",
  "-f", "lavfi",
  "-i", "color=c=white:s=1080x1920:r=30",
  "-t", "5",
  "-c:v", "libx264",
  "-pix_fmt", "yuv420p",
  "-preset", "ultrafast",
  "-movflags", "+faststart",
  salida
];

execFile("ffmpeg", argumentos, (error) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("✅ Video MP4 generado correctamente");
  console.log("Archivo:", salida);
});