import { spawn } from "child_process";
import fs from "fs";
import Pocketbase from "pocketbase";
import { BooksLibraryCollectionsSchemas } from "shared/types/collections";
import { Server } from "socket.io";

import {
  addToTaskPool,
  updateTaskInPool,
} from "@middlewares/taskPoolMiddleware";

export const addToLibrary = async (
  io: Server,
  pb: Pocketbase,
  md5: string,
  metadata: Omit<
    BooksLibraryCollectionsSchemas.IEntry,
    "thumbnail" | "file" | "is_favourite" | "is_read" | "time_finished"
  > & {
    thumbnail: string;
    file?: File;
  },
): Promise<string> => {
  const target = `http://libgen.li/ads.php?md5=${md5}`;

  const taskId = addToTaskPool(io, {
    module: "booksLibrary",
    description: `Adding book with title "${metadata.title}" to library`,
    status: "pending",
    data: {
      ...metadata,
      md5,
    },
    progress: {
      downloaded: "0B",
      total: "0B",
      percentage: "0%",
      speed: "0B/s",
      ETA: "0",
    },
  });

  (async () => {
    try {
      const data = await fetch(target).then((res) => res.text());

      const link = data.match(
        /<a href="(get\.php\?md5=.*?&key=.*?)"><h2>GET<\/h2><\/a>/,
      )?.[1];

      if (!link) throw new Error("Failed to add to library");

      const downloadLink = `http://libgen.li/${link}`;

      const downloadProcess = spawn("aria2c", [
        "--dir=./medium",
        `--out=${md5}.${metadata.extension}`,
        "--log-level=info",
        "-l-",
        "-x8",
        downloadLink,
      ]);

      downloadProcess.stdout.on("data", (data) => {
        data = data.toString();
        if (/ETA:/.test(data)) {
          const matches =
            /\[#\w{6} (?<downloaded>.*?)\/(?<total>.*?)\((?<percentage>.*?%)\).*?DL:(?<speed>.*?) ETA:(?<ETA>.*?)s\]/g.exec(
              data,
            );

          if (matches) {
            const { downloaded, total, percentage, speed, ETA } =
              matches.groups!;

            updateTaskInPool(io, taskId, {
              status: "running",
              progress: {
                downloaded,
                total,
                percentage,
                speed,
                ETA,
              },
            });
          }
        }
      });

      downloadProcess.stderr.on("data", (data) => {
        updateTaskInPool(io, taskId, {
          status: "failed",
          error: data.toString(),
        });
      });

      downloadProcess.on("error", (err) => {
        updateTaskInPool(io, taskId, {
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      });

      downloadProcess.on("close", async () => {
        if (!fs.existsSync(`./medium/${md5}.${metadata.extension}`)) {
          updateTaskInPool(io, taskId, {
            status: "failed",
            error: "Downloaded file not found",
          });
          return;
        }

        try {
          await processDownloadedFiles(pb, md5, metadata);

          updateTaskInPool(io, taskId, {
            status: "completed",
          });

          fs.unlinkSync(`./medium/${md5}.${metadata.extension}`);
        } catch (error) {
          fs.unlinkSync(`./medium/${md5}.${metadata.extension}`);
          throw error;
        }
      });

      return { initiated: true };
    } catch (error) {
      updateTaskInPool(io, taskId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  })();

  return taskId;
};

const processDownloadedFiles = async (
  pb: Pocketbase,
  md5: string,
  metadata: Omit<
    BooksLibraryCollectionsSchemas.IEntry,
    "thumbnail" | "file" | "is_favourite" | "is_read" | "time_finished"
  > & {
    thumbnail: string | File;
    file?: File;
  },
): Promise<void> => {
  await fetch(metadata.thumbnail as string).then(async (response) => {
    if (response.ok) {
      const buffer = await response.arrayBuffer();

      metadata.thumbnail = new File([buffer], "image.jpg", {
        type: "image/jpeg",
      });
    }
  });

  const file = fs.readFileSync("./medium/" + md5 + "." + metadata.extension);

  if (!file) throw new Error("Failed to read file");
  metadata.file = new File([file], `${md5}.${metadata.extension}`);
  metadata.size = file.byteLength;

  await pb.collection("books_library__entries").create(metadata);
};
