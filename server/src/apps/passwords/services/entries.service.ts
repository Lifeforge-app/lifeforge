import { decrypt, decrypt2, encrypt, encrypt2 } from "@functions/encryption";
import PocketBase from "pocketbase";
import { PasswordsSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { getDecryptedMaster } from "./master.service";

export const getAllEntries = async (
  pb: PocketBase,
): Promise<WithPB<PasswordsSchemas.IEntry>[]> =>
  await pb
    .collection("passwords__entries")
    .getFullList<WithPB<PasswordsSchemas.IEntry>>({
      sort: "-pinned, name",
    });

export const createEntry = async (
  pb: PocketBase,
  {
    name,
    icon,
    color,
    website,
    username,
    password,
    master,
  }: Omit<PasswordsSchemas.IEntry, "decrypted" | "pinned"> & { master: string },
  challenge: string,
): Promise<WithPB<PasswordsSchemas.IEntry>> => {
  const decryptedMaster = await getDecryptedMaster(pb, master, challenge);

  const decryptedPassword = decrypt2(password, challenge);
  const encryptedPassword = encrypt(
    Buffer.from(decryptedPassword),
    decryptedMaster,
  );

  const entry = await pb
    .collection("passwords__entries")
    .create<WithPB<PasswordsSchemas.IEntry>>({
      name,
      icon,
      color,
      website,
      username,
      password: encryptedPassword.toString("base64"),
    });

  return entry;
};

export const updateEntry = async (
  pb: PocketBase,
  id: string,
  {
    name,
    icon,
    color,
    website,
    username,
    password,
    master,
  }: Omit<PasswordsSchemas.IEntry, "decrypted" | "pinned"> & { master: string },
  challenge: string,
): Promise<WithPB<PasswordsSchemas.IEntry>> => {
  const decryptedMaster = await getDecryptedMaster(pb, master, challenge);

  const decryptedPassword = decrypt2(password, challenge);
  const encryptedPassword = encrypt(
    Buffer.from(decryptedPassword),
    decryptedMaster,
  );

  const entry = await pb
    .collection("passwords__entries")
    .update<WithPB<PasswordsSchemas.IEntry>>(id, {
      name,
      icon,
      color,
      website,
      username,
      password: encryptedPassword.toString("base64"),
    });

  return entry;
};

export const decryptEntry = async (
  pb: PocketBase,
  id: string,
  master: string,
  challenge: string,
): Promise<string> => {
  const decryptedMaster = await getDecryptedMaster(pb, master, challenge);

  const password: PasswordsSchemas.IEntry = await pb
    .collection("passwords__entries")
    .getOne(id);

  const decryptedPassword = decrypt(
    Buffer.from(password.password, "base64"),
    decryptedMaster,
  );

  return encrypt2(decryptedPassword.toString(), challenge);
};

export const deleteEntry = async (pb: PocketBase, id: string) => {
  await pb.collection("passwords__entries").delete(id);
};

export const togglePin = async (
  pb: PocketBase,
  id: string,
): Promise<WithPB<PasswordsSchemas.IEntry>> => {
  const entry = await pb
    .collection("passwords__entries")
    .getOne<WithPB<PasswordsSchemas.IEntry>>(id);

  return await pb
    .collection("passwords__entries")
    .update<WithPB<PasswordsSchemas.IEntry>>(id, {
      pinned: !entry.pinned,
    });
};
