import { exec } from "child_process";
import { readFileSync, readdirSync, unlinkSync } from "fs";
import Pocketbase from "pocketbase";
import { v4 } from "uuid";

import { IYoutubeData } from "../schema";

let downloadStatus: "empty" | "in_progress" | "completed" | "failed" = "empty";

export const getDownloadStatus = () => ({
  status: downloadStatus,
});

export const setDownloadStatus = (
  status: "empty" | "in_progress" | "completed" | "failed",
) => {
  downloadStatus = status;
};

export const getVideoInfo = (videoId: string): Promise<IYoutubeData> => {
  return new Promise((resolve, reject) => {
    exec(
      `${process.cwd()}/src/core/bin/yt-dlp --skip-download --print "title,upload_date,uploader,duration,view_count,like_count,thumbnail" "https://www.youtube.com/watch?v=${videoId}"`,
      (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }

        const [
          title,
          uploadDate,
          uploader,
          duration,
          viewCount,
          likeCount,
          thumbnail,
        ] = stdout.split("\n");

        const response: IYoutubeData = {
          title,
          uploadDate,
          uploader,
          duration,
          viewCount: +viewCount,
          likeCount: +likeCount,
          thumbnail,
        };

        resolve(response);
      },
    );
  });
};

export const downloadVideo = (
  pb: Pocketbase,
  videoId: string,
  metadata: {
    title: string;
    uploader: string;
    duration: number;
  },
) => {
  const downloadID = v4();

  exec(
    `${process.cwd()}/src/core/bin/yt-dlp -f bestaudio -o "${process.cwd()}/medium/${downloadID}-%(title)s.%(ext)s" --extract-audio --audio-format mp3 --audio-quality 0 "https://www.youtube.com/watch?v=${videoId}"`,
    async (err) => {
      if (err) {
        downloadStatus = "failed";
        return;
      }

      try {
        const allFiles = readdirSync(`${process.cwd()}/medium`);
        const mp3File = allFiles.find((file) => file.startsWith(downloadID));
        if (!mp3File) {
          downloadStatus = "failed";
          return;
        }

        const fileBuffer = readFileSync(`${process.cwd()}/medium/${mp3File}`);

        await pb.collection("music__entries").create({
          name: metadata.title,
          author: metadata.uploader,
          duration: metadata.duration,
          file: new File([fileBuffer], mp3File.split("-").slice(1).join("-")),
        });

        unlinkSync(`${process.cwd()}/medium/${mp3File}`);

        downloadStatus = "completed";
      } catch (error) {
        downloadStatus = "failed";
      }
    },
  );
};
