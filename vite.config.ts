import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' にしておくと、GitHub Pages のどのリポジトリ名でもそのまま動く
// （画面遷移はハッシュ方式なので再読み込みしても 404 にならない）
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
} as any);
