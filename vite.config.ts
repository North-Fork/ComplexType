import { defineConfig } from "vite";
export default defineConfig({ base: "/ComplexType/", server: { port: 5173, strictPort: true }, build: { target: "es2022" } });
