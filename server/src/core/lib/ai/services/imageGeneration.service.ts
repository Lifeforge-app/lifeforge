import ClientError from "@functions/ClientError";
import { getAPIKey } from "@functions/getAPIKey";
import OpenAI from "openai";
import PocketBase from "pocketbase";

export const generateImage = async (
  pb: PocketBase,
  prompt: string,
): Promise<string> => {
  const key = await getAPIKey("openai", pb);

  if (!key) {
    throw new ClientError("OpenAI API key not found");
  }

  const openai = new OpenAI({
    apiKey: key,
  });

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1792x1024",
  });

  if (!response.data?.[0].url) {
    throw new Error("No image generated");
  }

  return response.data[0].url;
};
