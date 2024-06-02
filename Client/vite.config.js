<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
=======
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
>>>>>>> main

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
