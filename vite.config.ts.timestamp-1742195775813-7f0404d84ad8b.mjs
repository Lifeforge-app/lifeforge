// vite.config.ts
import tailwindcss from "file:///Users/melvinchia/Desktop/lifeforge/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///Users/melvinchia/Desktop/lifeforge/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import { defineConfig } from "file:///Users/melvinchia/Desktop/lifeforge/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/melvinchia/Desktop/lifeforge";
var ReactCompilerConfig = {
  sources: (filename) => {
    return true;
  }
};
var vite_config_default = defineConfig({
  envDir: path.resolve(__vite_injected_original_dirname, "./env"),
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]]
      }
    }),
    tailwindcss()
    // mkcert()
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@providers": path.resolve(__vite_injected_original_dirname, "./src/core/providers"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/core/hooks"),
      "@interfaces": path.resolve(__vite_injected_original_dirname, "./src/core/interfaces"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/core/utils"),
      "@modules": path.resolve(__vite_injected_original_dirname, "./src/modules"),
      "@security": path.resolve(__vite_injected_original_dirname, "./src/core/security")
    }
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWVsdmluY2hpYS9EZXNrdG9wL2xpZmVmb3JnZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21lbHZpbmNoaWEvRGVza3RvcC9saWZlZm9yZ2Uvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21lbHZpbmNoaWEvRGVza3RvcC9saWZlZm9yZ2Uvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuXG4vLyBpbXBvcnQgbWtjZXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLW1rY2VydCdcblxuY29uc3QgUmVhY3RDb21waWxlckNvbmZpZyA9IHtcbiAgc291cmNlczogZmlsZW5hbWUgPT4ge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGVudkRpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vZW52JyksXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbWydiYWJlbC1wbHVnaW4tcmVhY3QtY29tcGlsZXInLCBSZWFjdENvbXBpbGVyQ29uZmlnXV1cbiAgICAgIH1cbiAgICB9KSxcbiAgICB0YWlsd2luZGNzcygpXG4gICAgLy8gbWtjZXJ0KClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxuICAgICAgJ0Bwcm92aWRlcnMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29yZS9wcm92aWRlcnMnKSxcbiAgICAgICdAaG9va3MnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29yZS9ob29rcycpLFxuICAgICAgJ0BpbnRlcmZhY2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2NvcmUvaW50ZXJmYWNlcycpLFxuICAgICAgJ0B1dGlscyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb3JlL3V0aWxzJyksXG4gICAgICAnQG1vZHVsZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbW9kdWxlcycpLFxuICAgICAgJ0BzZWN1cml0eSc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb3JlL3NlY3VyaXR5JylcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlkXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICAgIC5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpWzBdXG4gICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXNuZXh0J1xuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsT0FBTyxpQkFBaUI7QUFDblQsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUg3QixJQUFNLG1DQUFtQztBQU96QyxJQUFNLHNCQUFzQjtBQUFBLEVBQzFCLFNBQVMsY0FBWTtBQUNuQixXQUFPO0FBQUEsRUFDVDtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUSxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLEVBQ3ZDLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyxDQUFDLCtCQUErQixtQkFBbUIsQ0FBQztBQUFBLE1BQ2hFO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxZQUFZO0FBQUE7QUFBQSxFQUVkO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxlQUFlLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxjQUFjLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxNQUM1RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUNwRCxlQUFlLEtBQUssUUFBUSxrQ0FBVyx1QkFBdUI7QUFBQSxNQUM5RCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUNwRCxZQUFZLEtBQUssUUFBUSxrQ0FBVyxlQUFlO0FBQUEsTUFDbkQsYUFBYSxLQUFLLFFBQVEsa0NBQVcscUJBQXFCO0FBQUEsSUFDNUQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixhQUFhLElBQUk7QUFDZixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU8sR0FDSixTQUFTLEVBQ1QsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUN4QixNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQ1osU0FBUztBQUFBLFVBQ2Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
