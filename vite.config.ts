import { cloudflare } from "@cloudflare/vite-plugin"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig(() => {
   return {
      plugins: [
         cloudflare(),
         tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
         }),
         react(),
         babel({
            presets: [reactCompilerPreset()],
         }),
         tailwindcss(),
      ],
      preview: {
         port: 3000,
      },
      server: {
         port: 3000,
      },
      resolve: {
         tsconfigPaths: true,
      },
   }
})
