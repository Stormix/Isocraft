import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __APP_NAME__: JSON.stringify(process.env.npm_package_name)
  }
})
