import getPBWithSuperuser from "@functions/getPBWithSuperuser";
import moment from "moment";

export const listBackups = async (): Promise<
  Array<{ key: string; size: number; modified: string }>
> => {
  const pb = await getPBWithSuperuser();

  const allBackups = await pb.backups.getFullList();

  return allBackups.sort((a, b) => b.modified.localeCompare(a.modified));
};

export const downloadBackup = async (key: string): Promise<Buffer> => {
  const pb = await getPBWithSuperuser();
  const token = await pb.files.getToken();

  const downloadURL = pb.backups.getDownloadURL(token, key);
  const response = await fetch(downloadURL);

  if (!response.ok) {
    throw new Error(`Failed to download backup: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export const createBackup = async (backupName?: string): Promise<void> => {
  const pb = await getPBWithSuperuser();

  if (!backupName) {
    backupName = `pb_backup_lifeforge_${moment().format("YYYYMMDD_HHmmss")}.zip`;
  }

  await pb.backups.create(backupName);
};

export const deleteBackup = async (key: string): Promise<void> => {
  const pb = await getPBWithSuperuser();

  await pb.backups.delete(key);
};
