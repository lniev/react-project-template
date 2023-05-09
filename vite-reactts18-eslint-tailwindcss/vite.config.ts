// https://vitejs.dev/config/
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
import fs from 'fs'
import path from 'path'
// @ts-ignore
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: '/',
    server: {
      port: 3000
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    build: {
      sourcemap: env.VITE_APP_ENV === 'test',
      target: 'chrome80',
      reportCompressedSize: false,
      outDir: 'build',
      assetsDir: 'static',
      cssCodeSplit: true,
      cssTarget: 'chrome80',
      assetsInlineLimit: 4096 * 4,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-router-dom'],
            echarts: ['echarts'],
            lodash: ['lodash'],
            antd: ['antd'],
            moment: ['moment'],
            html2canvas: ['html2canvas']
          }
        }
      }
    },
    plugins: [
      react({
        jsxRuntime: 'classic',
        babel: {
          plugins: [
            '@babel/plugin-transform-react-jsx'
          ]
        }
      }),
      eslint()
    ],
    esbuild: {
      minify: true
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
        {
          find: /^~/,
          replacement: ''
        }
      ]
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup (build) {
              // @ts-ignore
              build.onLoad({ filter: /src\/.*\.js$/ }, async args => ({
                loader: 'jsx',
                contents: await fs.readFile(args.path, 'utf8')
              }))
            }
          }
        ]
      }
    }
  }
})
