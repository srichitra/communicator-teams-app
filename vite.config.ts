import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import fs from "fs";

export default defineConfig({
  base: '/communicator-teams-app/',
  plugins: [react()],
  define: {
    'process.env.TEAMS_APP_SKIP_PREREQUISITE_CHECK': 'true',
//    global: "globalThis",
  }//,
  //server: {
  //  port: 53000,
  //  https: {
  //    cert: process.env.SSL_CRT_FILE ? fs.readFileSync(process.env.SSL_CRT_FILE) : undefined,
  //    key: process.env.SSL_KEY_FILE ? fs.readFileSync(process.env.SSL_KEY_FILE) : undefined,
  //  },
  //},
});
