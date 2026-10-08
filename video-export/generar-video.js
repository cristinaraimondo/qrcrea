const { execFile } = require("node:child_process");
const ffmpegPath = require("ffmpeg-static");
const path = require("node:path");

const imagen = path.join(__dirname, "tarjeta-qrcrea.png");
const musica = path.join(__dirname, "musica.mp3");
const salida = path.join(__dirname, "tarjeta-final.mp4");

const argumentos = [
  "-y",
  "-loop", "1",
  "-framerate", "30",
 "-i", imagen,
"-i", musica,
"-shortest",
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
  salida
];

execFile(ffmpegPath, argumentos, (error) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("✅ Tarjeta exportada correctamente a MP4");
  console.log("Archivo:", salida);
});