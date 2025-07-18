import fs from "fs";
// @ts-expect-error - No types available
import pdfPageCounter from "pdf-page-counter";
import pdfThumbnail from "pdf-thumbnail";
import PocketBase, { ListResult } from "pocketbase";
import { GuitarTabsCollectionsSchemas } from "shared/types/collections";
import { Server } from "socket.io";

import { WithPB } from "@typescript/pocketbase_interfaces";

import {
  addToTaskPool,
  globalTaskPool,
  updateTaskInPool,
} from "@middlewares/taskPoolMiddleware";

let left = 0;

export const getRandomEntry = async (
  pb: PocketBase,
): Promise<WithPB<GuitarTabsCollectionsSchemas.IEntry>> => {
  const allScores = await pb
    .collection("guitar_tabs__entries")
    .getFullList<WithPB<GuitarTabsCollectionsSchemas.IEntry>>();

  return allScores[Math.floor(Math.random() * allScores.length)];
};

export const getSidebarData = async (
  pb: PocketBase,
): Promise<GuitarTabsCollectionsSchemas.IGuitarTabsSidebarData> => {
  const allScores = await pb
    .collection("guitar_tabs__entries")
    .getFullList<WithPB<GuitarTabsCollectionsSchemas.IEntry>>();

  const allAuthors = await pb
    .collection("guitar_tabs__authors_aggregated")
    .getFullList<WithPB<GuitarTabsCollectionsSchemas.IAuthorAggregated>>();

  return {
    total: allScores.length,
    favourites: allScores.filter((entry) => entry.isFavourite).length,
    categories: {
      fingerstyle: allScores.filter((entry) => entry.type === "fingerstyle")
        .length,
      singalong: allScores.filter((entry) => entry.type === "singalong").length,
      uncategorized: allScores.filter((entry) => entry.type === "").length,
    },
    authors: Object.fromEntries(
      allAuthors.map((author) => [author.name, author.amount]),
    ),
  } satisfies GuitarTabsCollectionsSchemas.IGuitarTabsSidebarData;
};

export const getEntries = (
  pb: PocketBase,
  {
    page,
    query = "",
    category,
    author,
    starred,
    sort,
  }: {
    page: number;
    query?: string;
    category?: string;
    author?: string;
    starred: boolean;
    sort: "name" | "author" | "newest" | "oldest";
  },
): Promise<ListResult<WithPB<GuitarTabsCollectionsSchemas.IEntry>>> => {
  return pb
    .collection("guitar_tabs__entries")
    .getList<WithPB<GuitarTabsCollectionsSchemas.IEntry>>(page, 20, {
      filter: `(name~"${query}" || author~"${query}") 
        ${category ? `&& type="${category === "uncategorized" ? "" : category}"` : ""} 
        ${author ? `&& ${author === "[na]" ? "author = ''" : `author~"${author}"`}` : ""} 
        ${starred ? "&& isFavourite=true" : ""}`,
      sort: `-isFavourite, ${
        {
          name: "name",
          author: "author",
          newest: "-created",
          oldest: "created",
        }[sort]
      }`,
    });
};

export const uploadFiles = async (
  io: Server,
  pb: PocketBase,
  files: Express.Multer.File[],
) => {
  const taskId = addToTaskPool(io, {
    module: "guitarTabs",
    description: "Uploading music scores from local",
    progress: {
      left: 0,
      total: 0,
    },
    status: "pending",
  });

  (async () => {
    try {
      let groups: Record<
        string,
        {
          pdf: Express.Multer.File | null;
          mscz: Express.Multer.File | null;
          mp3: Express.Multer.File | null;
        }
      > = {};

      for (const file of files) {
        const decodedName = decodeURIComponent(file.originalname);

        const extension = decodedName.split(".").pop();

        if (!extension || !["mscz", "mp3", "pdf"].includes(extension)) continue;

        const name = decodedName.split(".").slice(0, -1).join(".");

        if (!groups[name]) {
          groups[name] = {
            pdf: null,
            mscz: null,
            mp3: null,
          };
        }

        groups[name][extension as "pdf" | "mscz" | "mp3"] = file;
      }

      for (const group of Object.values(groups)) {
        if (group.pdf) continue;

        for (const file of Object.values(group)) {
          if (!file) continue;

          fs.unlinkSync(file.path);
        }
      }

      groups = Object.fromEntries(
        Object.entries(groups).filter(([_, group]) => group.pdf),
      );

      updateTaskInPool(io, taskId, {
        status: "running",
        progress: {
          left: Object.keys(groups).length,
          total: Object.keys(groups).length,
        },
      });

      left = Object.keys(groups).length;

      processFiles(pb, groups, io, taskId);

      return { status: "success" };
    } catch (error) {
      updateTaskInPool(io, taskId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });

      return { status: "error", message: "Failed to process files" };
    }
  })();

  return taskId;
};

const processFiles = async (
  pb: PocketBase,
  groups: Record<
    string,
    {
      pdf: Express.Multer.File | null;
      mscz: Express.Multer.File | null;
      mp3: Express.Multer.File | null;
    }
  >,
  io: Server,
  taskId: string,
) => {
  for (let groupIdx = 0; groupIdx < Object.keys(groups).length; groupIdx++) {
    try {
      const group = groups[Object.keys(groups)[groupIdx]];

      const file = group.pdf!;

      const decodedName = decodeURIComponent(file.originalname);

      const name = decodedName.split(".").slice(0, -1).join(".");

      const path = file.path;

      const buffer = fs.readFileSync(path);

      const thumbnail = await pdfThumbnail(buffer, {
        compress: {
          type: "JPEG",
          quality: 70,
        },
      });

      const { numpages } = await pdfPageCounter(buffer);

      thumbnail
        .pipe(fs.createWriteStream(`medium/${decodedName}.jpg`))
        .once("close", async () => {
          try {
            const thumbnailBuffer = fs.readFileSync(
              `medium/${decodedName}.jpg`,
            );

            const otherFiles: {
              audio: File | null;
              musescore: File | null;
            } = {
              audio: null,
              musescore: null,
            };

            if (group.mscz) {
              otherFiles.musescore = new File(
                [fs.readFileSync(group.mscz.path)],
                group.mscz.originalname,
              );
            }

            if (group.mp3) {
              otherFiles.audio = new File(
                [fs.readFileSync(group.mp3.path)],
                group.mp3.originalname,
              );
            }

            await pb
              .collection("guitar_tabs__entries")
              .create<WithPB<GuitarTabsCollectionsSchemas.IEntry>>(
                {
                  name,
                  thumbnail: new File([thumbnailBuffer], `${decodedName}.jpeg`),
                  author: "",
                  pdf: new File([buffer], decodedName),
                  pageCount: numpages,
                  ...otherFiles,
                },
                {
                  $autoCancel: false,
                },
              );

            fs.unlinkSync(path);
            fs.unlinkSync(`medium/${decodedName}.jpg`);

            if (group.mscz) {
              fs.unlinkSync(group.mscz.path);
            }

            if (group.mp3) {
              fs.unlinkSync(group.mp3.path);
            }

            if (!(globalTaskPool[taskId].progress instanceof Object)) {
              return;
            }

            left--;

            if (left === 0) {
              updateTaskInPool(io, taskId, {
                status: "completed",
              });
            } else {
              updateTaskInPool(io, taskId, {
                status: "running",
                progress: {
                  left,
                  total: Object.keys(groups).length,
                },
              });
            }
          } catch (err) {
            updateTaskInPool(io, taskId, {
              status: "failed",
              error: err instanceof Error ? err.message : "Unknown error",
            });

            fs.unlinkSync(path);
            fs.unlinkSync(`medium/${decodedName}.jpg`);

            if (group.mscz) {
              fs.unlinkSync(group.mscz.path);
            }

            if (group.mp3) {
              fs.unlinkSync(group.mp3.path);
            }
          }
        });
    } catch (err) {
      console.error("Error processing group:", err);
      updateTaskInPool(io, taskId, {
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown error",
      });

      const allFilesLeft = fs.readdirSync("medium");

      for (const file of allFilesLeft) {
        fs.unlinkSync(`medium/${file}`);
      }

      break;
    }
  }
};

export const updateEntry = (
  pb: PocketBase,
  id: string,
  {
    name,
    author,
    type,
  }: Pick<GuitarTabsCollectionsSchemas.IEntry, "name" | "author" | "type">,
): Promise<WithPB<GuitarTabsCollectionsSchemas.IEntry>> =>
  pb
    .collection("guitar_tabs__entries")
    .update<WithPB<GuitarTabsCollectionsSchemas.IEntry>>(id, {
      name,
      author,
      type,
    });

export const deleteEntry = async (pb: PocketBase, id: string) => {
  await pb.collection("guitar_tabs__entries").delete(id);
};

export const toggleFavorite = async (
  pb: PocketBase,
  id: string,
): Promise<WithPB<GuitarTabsCollectionsSchemas.IEntry>> => {
  const entry = await pb
    .collection("guitar_tabs__entries")
    .getOne<WithPB<GuitarTabsCollectionsSchemas.IEntry>>(id);

  return await pb
    .collection("guitar_tabs__entries")
    .update<WithPB<GuitarTabsCollectionsSchemas.IEntry>>(id, {
      isFavourite: !entry.isFavourite,
    });
};
