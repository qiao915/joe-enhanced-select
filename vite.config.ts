import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/components/JoeEnhancedSelect/index.tsx'),
      name: 'JoeEnhancedSelect',
      fileName: (format) => `jes.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // 更严格的外部依赖配置，确保所有 React 相关的模块都被视为外部依赖
      external: [
        'react',
        'react-dom',
        /^react\/.*/,
        /^react-dom\/.*/,
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        exports: 'auto',
        // 确保输出的代码与不同版本的 React 兼容
        interop: 'auto',
        // 确保输出的代码使用标准的 ES 模块语法
        esModule: true,
      },
    },
    // 禁用 sourcemap 以减少构建文件大小
    sourcemap: false,
  },
  // 确保使用正确的 React 版本
  resolve: {
    mainFields: ['module', 'main'],
  },
})
