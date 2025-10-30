import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import fs from "fs"
import path from "path"

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3041',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    {
      name: "update-version-and-service-worker",
      apply: "build",
      async closeBundle() {
        try {
          // Path to package.json
          const packageJsonPath = path.resolve(__dirname, "package.json")

          // Read and parse package.json
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf-8")
          )

          // Extract current version and increment it
          const currentVersion = packageJson.version || "0.0.0"
          const versionParts = currentVersion.split(".").map(Number)

          if (versionParts.length !== 3 || versionParts.some(isNaN)) {
            throw new Error(
              `Invalid version format in package.json: ${currentVersion}`
            )
          }

          versionParts[2]++ // Increment patch version
          const newVersion = versionParts.join(".")

          // Update the version in package.json
          packageJson.version = newVersion
          fs.writeFileSync(
            packageJsonPath,
            JSON.stringify(packageJson, null, 2),
            "utf-8"
          )
          console.log("Updated package.json to version:", newVersion)

          const service_worker_path = [
            "dist/service-worker.js",
            "public/service-worker.js"
          ]
          // Path to service-worker.js
          for (let i = 0; service_worker_path.length > i; i++) {
            const serviceWorkerPath = path.resolve(
              __dirname,
              service_worker_path[i]
            )

            if (!fs.existsSync(serviceWorkerPath)) {
              console.error(
                "service-worker.js not found at:",
                serviceWorkerPath
              )
              return
            }

            // Read and update service-worker.js
            let serviceWorker = fs.readFileSync(serviceWorkerPath, "utf-8")

            // Regex to match the CACHE_NAME constant
            const cacheNameRegex = /const CACHE_NAME\s*=\s*["'][^"']*["'];?/

            if (!cacheNameRegex.test(serviceWorker)) {
              throw new Error(
                "CACHE_NAME constant not found in service-worker.js."
              )
            }

            // Replace CACHE_NAME with the new version
            serviceWorker = serviceWorker.replace(
              cacheNameRegex,
              `const CACHE_NAME = "my-app-cache-v${newVersion}";`
            )

            // Write the updated service-worker.js
            fs.writeFileSync(serviceWorkerPath, serviceWorker, "utf-8")
            console.log("Updated service-worker.js to version:", newVersion)
          }
        } catch (error) {
          console.error(
            "Error updating package.json and service-worker.js:",
            error
          )
        }
      }
    }
  ]
})
