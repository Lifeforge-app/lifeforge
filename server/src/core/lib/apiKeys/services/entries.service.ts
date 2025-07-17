import ClientError from "@functions/ClientError";
import { decrypt2, encrypt2 } from "@functions/encryption";
import bcrypt from "bcrypt";
import PocketBase from "pocketbase";
import { ApiKeysSchemas } from "shared";

import { WithPB } from "@typescript/pocketbase_interfaces";

import { challenge } from "./auth.service";

export default async function getDecryptedMaster(
  pb: PocketBase,
  master: string,
): Promise<string> {
  if (!pb.authStore.record) {
    throw new ClientError("Auth store not initialized", 401);
  }

  const { APIKeysMasterPasswordHash } = pb.authStore.record;
  const decryptedMaster = decrypt2(master, challenge);
  const isMatch = await bcrypt.compare(
    decryptedMaster,
    APIKeysMasterPasswordHash,
  );

  if (!isMatch) {
    throw new ClientError("Invalid master password", 401);
  }

  return decryptedMaster;
}

export const getAllEntries = async (
  pb: PocketBase,
): Promise<WithPB<ApiKeysSchemas.IEntry>[]> => {
  const entries = await pb
    .collection("api_keys__entries")
    .getFullList<WithPB<ApiKeysSchemas.IEntry>>({
      sort: "name",
    });

  entries.forEach((entry) => {
    entry.key = decrypt2(entry.key, process.env.MASTER_KEY!)
      .toString()
      .slice(-4);
  });

  return entries;
};

export const checkKeys = async (
  pb: PocketBase,
  keys: string,
): Promise<boolean> => {
  const allEntries = await pb.collection("api_keys__entries").getFullList();

  return keys
    .split(",")
    .every((key) => allEntries.some((entry) => entry.keyId === key));
};

export const getEntryById = async (
  pb: PocketBase,
  id: string,
  decryptedMaster: string,
): Promise<string> => {
  const entry = await pb.collection("api_keys__entries").getOne(id);

  if (!entry) {
    throw new Error("Entry not found");
  }

  const decryptedKey = decrypt2(entry.key, process.env.MASTER_KEY!);
  const encryptedKey = encrypt2(decryptedKey, decryptedMaster);
  const encryptedSecondTime = encrypt2(encryptedKey, challenge);

  return encryptedSecondTime;
};

export const createEntry = async (
  pb: PocketBase,
  {
    keyId,
    name,
    description,
    icon,
    key,
    decryptedMaster,
  }: {
    keyId: string;
    name: string;
    description: string;
    icon: string;
    key: string;
    decryptedMaster: string;
  },
): Promise<WithPB<ApiKeysSchemas.IEntry>> => {
  const decryptedKey = decrypt2(key, decryptedMaster);
  const encryptedKey = encrypt2(decryptedKey, process.env.MASTER_KEY!);

  const entry = await pb
    .collection("api_keys__entries")
    .create<WithPB<ApiKeysSchemas.IEntry>>({
      keyId,
      name,
      description,
      icon,
      key: encryptedKey,
    });

  entry.key = decryptedKey.slice(-4);

  return entry;
};

export const updateEntry = async (
  pb: PocketBase,
  id: string,
  {
    keyId,
    name,
    description,
    icon,
    key,
    decryptedMaster,
  }: {
    keyId: string;
    name: string;
    description: string;
    icon: string;
    key: string;
    decryptedMaster: string;
  },
): Promise<WithPB<ApiKeysSchemas.IEntry>> => {
  const decryptedKey = decrypt2(key, decryptedMaster);
  const encryptedKey = encrypt2(decryptedKey, process.env.MASTER_KEY!);

  const updatedEntry = await pb
    .collection("api_keys__entries")
    .update<WithPB<ApiKeysSchemas.IEntry>>(id, {
      keyId,
      name,
      description,
      icon,
      key: encryptedKey,
    });

  updatedEntry.key = decryptedKey.slice(-4);

  return updatedEntry;
};

export const deleteEntry = async (
  pb: PocketBase,
  id: string,
): Promise<void> => {
  await pb.collection("api_keys__entries").delete(id);
};
