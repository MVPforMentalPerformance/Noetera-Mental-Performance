import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

if (!ffmpegPath) {
  throw new Error(
    "ffmpeg-static did not provide a binary for this platform. Try installing ffmpeg system-wide."
  );
}

const root = process.cwd();
const sourceDir =
  process.env.SOURCE_DIR ?? "C:\\Users\\dda31\\Downloads\\Audio files";
const outDir = path.join(root, "public", "audio", "program");

const inputs = [
  { day: 1, filename: "Intro and Day1.wav" },
  { day: 2, filename: "Day2.wav" },
  { day: 3, filename: "Day3.wav" },
  { day: 4, filename: "Day4.wav" },
  { day: 5, filename: "Day5.wav" },
];

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath, args, { stdio: "inherit" });
    p.on("error", reject);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

await fs.mkdir(outDir, { recursive: true });

for (const { day, filename } of inputs) {
  const inputPath = path.join(sourceDir, filename);
  const outputPath = path.join(outDir, `day-${day}.mp3`);

  // 160kbps MP3 is a good default for guided voice audio.
  await runFfmpeg([
    "-y",
    "-i",
    inputPath,
    "-vn",
    "-c:a",
    "libmp3lame",
    "-b:a",
    "160k",
    "-ar",
    "44100",
    outputPath,
  ]);
}

console.log(`Done. Wrote MP3 files to ${outDir}`);
