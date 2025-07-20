import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const options = {
  // See https://mdxjs.com/advanced/plugins
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHighlight],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdx(options)],
});
