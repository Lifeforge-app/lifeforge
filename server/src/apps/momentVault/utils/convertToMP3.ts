import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export async function convertToMp3(filePath: string) {
  process.env.FFMPEG_PATH = "/usr/bin/ffmpeg";

  return new Promise<string>((resolve, reject) => {
    const newPath = filePath.split(".").slice(0, -1).join(".") + ".mp3";
    ffmpeg(filePath)
      .output(newPath)
      .on("end", () => {
        fs.unlinkSync(filePath);
        resolve(newPath);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
}
