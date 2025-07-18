import ClientError from "@functions/ClientError";
import { decrypt2 } from "@functions/encryption";
import bcrypt from "bcrypt";
import PocketBase from "pocketbase";

export const getDecryptedMaster = async (
  pb: PocketBase,
  master: string,
  challenge: string,
): Promise<string> => {
  const { masterPasswordHash } = pb.authStore.record as any;

  const decryptedMaster = decrypt2(master, challenge);

  const isMatch = await bcrypt.compare(decryptedMaster, masterPasswordHash);

  if (!isMatch) {
    throw new ClientError("Invalid master password", 401);
  }

  return decryptedMaster;
};

export const createMaster = async (
  pb: PocketBase,
  password: string,
): Promise<void> => {
  const salt = await bcrypt.genSalt(10);

  const masterPasswordHash = await bcrypt.hash(password, salt);

  await pb.collection("users").update(pb.authStore.record!.id, {
    masterPasswordHash,
  });
};

export const verifyMaster = async (
  pb: PocketBase,
  password: string,
  challenge: string,
): Promise<boolean> => {
  const decryptedMaster = decrypt2(password, challenge);

  const user = await pb.collection("users").getOne(pb.authStore.record!.id);

  const { masterPasswordHash } = user;

  return await bcrypt.compare(decryptedMaster, masterPasswordHash);
};
