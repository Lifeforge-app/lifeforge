import PocketBase from "pocketbase";

export default async function getPBWithSuperuser(): Promise<PocketBase> {
  const pb = new PocketBase(process.env.PB_HOST!);

  await pb
    .collection("_superusers")
    .authWithPassword(process.env.PB_EMAIL!, process.env.PB_PASSWORD!);

  return pb;
}
