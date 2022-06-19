import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'web-env/page',
  },
  plugins: [
    vue(),
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
