import ClientError from "@functions/ClientError";
import { getAPIKey } from "@functions/getAPIKey";
import fs from "fs";
import Groq from "groq-sdk";
import PocketBase from "pocketbase";
import request from "request";
import { MomentVaultSchemas } from "shared/types";

const getTranscription = async (
  filePath: string,
  apiKey: string,
): Promise<string | null> => {
  const groq = new Groq({
    apiKey,
  });

  const transcription = await groq.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-large-v3",
  });

  return transcription.text;
};

export const transcribeExisted = async (
  pb: PocketBase,
  id: string,
): Promise<string> => {
  const apiKey = await getAPIKey("groq", pb);

  if (!apiKey) {
    throw new ClientError("API key not found");
  }

  const entry = await pb
    .collection("moment_vault__entries")
    .getOne<MomentVaultSchemas.IEntry>(id);

  if (!entry.file) {
    throw new ClientError("No audio file found in entry");
  }

  const fileURL = pb.files.getURL(entry, entry.file[0]);

  try {
    const filePath = `medium/${fileURL.split("/").pop()}`;
    const fileStream = fs.createWriteStream(filePath);

    request(fileURL).pipe(fileStream);

    await new Promise((resolve) => {
      fileStream.on("finish", () => {
        resolve(null);
      });
    });

    const response = await getTranscription(filePath, apiKey);

    if (!response) {
      throw new Error("Transcription failed");
    }

    await pb
      .collection("moment_vault__entries")
      .update<MomentVaultSchemas.IEntry>(id, {
        transcription: response,
      });

    return response;
  } catch (err) {
    console.error("Error during transcription:", err);
    throw new Error("Failed to transcribe audio file");
  } finally {
    const filePath = `medium/${fileURL.split("/").pop()}`;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export async function transcribeNew(
  pb: PocketBase,
  filePath: string,
): Promise<string> {
  const apiKey = await getAPIKey("groq", pb);

  if (!apiKey) {
    throw new ClientError("API key not found");
  }

  const response = await getTranscription(filePath, apiKey);

  if (!response) {
    throw new Error("Transcription failed");
  }

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return response;
}
