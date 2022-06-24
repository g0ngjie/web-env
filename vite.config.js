import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { visualizer } from 'rollup-plugin-visualizer';

const mode = process.env.MODE

const toolsBuild = {
  outDir: 'web-env/page',
  chunkSizeWarningLimit: 1 << 10,
  rollupOptions: {
    input: {
      devtools: path.resolve(__dirname, 'index.html'),
      popups: path.resolve(__dirname, 'popups.html'),
    },
    output: {
      chunkFileNames: 'static/js/[name]-[hash].js',
      entryFileNames: 'static/js/[name]-[hash].js',
      assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
    }
  },
}

const panelBuild = {
  outDir: 'web-env/dashboard',
  target: 'esnext',
  minify: 'terser',
  lib: {
    entry: 'src/dashboard/index.js',
    formats: ['umd'],
    name: 'dashboard',
    fileName: 'dashboard',
  }
}

const build = mode === 'tools' ? toolsBuild : panelBuild

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@devtools': path.resolve(__dirname, 'src/devtools'),
      '@popups': path.resolve(__dirname, 'src/popups')
    },
  },
  build,
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有包含短横线的标签作为自定义元素处理
          isCustomElement: tag => tag.includes('-')
        }
      }
    }),
    VueJsx({
      transformOn: true,
      mergeProps: true,
    }),
    visualizer(),
    viteStaticCopy({
      targets: [
        {
          src: './extension/*',
          dest: '..',
        }
      ]
    }),
  ]
})
