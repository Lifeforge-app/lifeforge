import fs from "fs";
import Pocketbase from "pocketbase";

if (!process.env.PB_HOST || !process.env.PB_EMAIL || !process.env.PB_PASSWORD) {
  console.error(
    "Please provide PB_HOST, PB_EMAIL, and PB_PASSWORD in your environment variables.",
  );
  process.exit(1);
}

const pb = new Pocketbase(process.env.PB_HOST);

try {
  await pb
    .collection("_superusers")
    .authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);

  if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
    console.error("Invalid credentials.");
    process.exit(1);
  }
} catch {
  console.error("Invalid credentials.");
  process.exit(1);
}

const schemaFiles = fs
  .readdirSync("./src", { recursive: true })
  .filter((file) => typeof file === "string" && file.endsWith("schema.json"));

console.log(`Found ${schemaFiles.length} schema files. Importing...`);

const allSchemas = schemaFiles
  .map((file) => {
    return JSON.parse(fs.readFileSync(`./src/${file}`, { encoding: "utf-8" }));
  })
  .flat();

await pb.collections.import(allSchemas);

console.log("Done.");
