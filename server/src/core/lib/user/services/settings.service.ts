import ClientError from "@functions/ClientError";
import fs from "fs";
import moment from "moment";
import PocketBase from "pocketbase";

export const updateAvatar = async (
  pb: PocketBase,
  file?: Express.Multer.File,
): Promise<string> => {
  if (!file) {
    throw new ClientError("No file uploaded");
  }

  const { id } = pb.authStore.record!;

  const fileBuffer = fs.readFileSync(file.path);

  const newRecord = await pb.collection("users").update(id, {
    avatar: new File(
      [fileBuffer],
      `${id}.${file.originalname.split(".").pop()}`,
    ),
  });

  fs.unlinkSync(file.path);

  return newRecord.avatar;
};

export const deleteAvatar = async (pb: PocketBase) => {
  const { id } = pb.authStore.record!;

  await pb.collection("users").update(id, {
    avatar: null,
  });
};

export const updateProfile = async (
  pb: PocketBase,
  data: {
    username?: string;
    name?: string;
    dateOfBirth?: string;
    email?: string;
  },
): Promise<void> => {
  const { id } = pb.authStore.record!;

  if (data.email) {
    await pb.collection("users").requestEmailChange(data.email);
    return;
  }

  const updateData: {
    username?: string;
    name?: string;
    dateOfBirth?: string;
  } = {};

  if (data.username) updateData.username = data.username;
  if (data.name) updateData.name = data.name;
  if (data.dateOfBirth) {
    updateData.dateOfBirth = `${moment(data.dateOfBirth).add(1, "day").format("YYYY-MM-DD")}T00:00:00.000Z`;
  }

  if (Object.keys(updateData).length > 0) {
    await pb.collection("users").update(id, updateData);
  }
};

export const requestPasswordReset = async (pb: PocketBase): Promise<void> => {
  await pb.collection("users").requestPasswordReset(pb.authStore.record?.email);
};
