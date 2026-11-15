// dist を削除する。
// Windows + Node 25 + 日本語を含むパスでは fs.rmSync(recursive) が異常終了することがあるため、
// ファイルを 1 つずつ消す方法にしている（vite の emptyOutDir も同じ理由で使わない）。
import { existsSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

function removeDir(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) removeDir(p);
    else unlinkSync(p);
  }
  rmdirSync(dir);
}

if (existsSync('dist')) removeDir('dist');
