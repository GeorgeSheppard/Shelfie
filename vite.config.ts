import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { copyFileSync } from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      {
        name: "copy-redirects",
        closeBundle() {
          copyFileSync("_redirects", "dist/_redirects");
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    assetsInclude: ["**/*.lottie", "**/*.svg", "**/*.ttf"],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_SERVER_URL,
          changeOrigin: true,
          secure: env.VITE_SECURE_SERVER === "true",
        },
      },
    },
  };
});
