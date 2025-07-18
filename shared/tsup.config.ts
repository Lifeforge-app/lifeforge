import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/lib/index.ts", "src/types/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  minify: true,
  dts: true,
  clean: true,
});
