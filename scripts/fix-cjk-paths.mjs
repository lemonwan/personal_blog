/**
 * 修复静态导出目录名：Next.js 静态导出会把含非 ASCII 字符的 slug
 * 以百分号编码（%XX）作为目录名写盘，而 nginx 等 Web 服务器会先对
 * URL 解码一次再映射到文件系统，导致 /xxx-原理（解码后）找不到
 * 磁盘上的 xxx-%E5%8E%9F%E7%90%86 目录 → 404。
 *
 * 本脚本在 build 后把 out/ 内所有含 %XX 序列的文件/目录名解码回
 * UTF-8 原名，使「URL 解码后的路径」与磁盘目录名一致。
 *
 * 用法：node scripts/fix-cjk-paths.mjs [outDir]   （默认 out）
 * 已接入 package.json 的 postbuild，`npm run build` 后自动执行。
 */
import { readdirSync, renameSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || "out";
let renamed = 0;

const ENCODED = /%(?:[0-9A-Fa-f]{2})+/;

function tryDecode(name) {
  try {
    const decoded = decodeURIComponent(name);
    if (decoded === name) return null;
    // 解码结果不允许出现路径分隔符，避免越界
    if (decoded.includes("/") || decoded.includes("\0")) return null;
    return decoded;
  } catch {
    return null; // 非法 % 序列（不是编码），跳过
  }
}

function fixDir(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p, { throwIfNoEntry: false });
    if (!st) continue;
    if (st.isDirectory()) fixDir(p); // 先处理子项
    if (ENCODED.test(name)) {
      const decoded = tryDecode(name);
      if (decoded) {
        renameSync(p, join(dir, decoded));
        renamed++;
        console.log(`  renamed: ${name} -> ${decoded}`);
      } else {
        console.warn(`  skip (not valid encoding): ${name}`);
      }
    }
  }
}

try {
  console.log(`fix-cjk-paths: scanning ${root}/`);
  fixDir(root);
  console.log(`fix-cjk-paths: done, ${renamed} path(s) renamed.`);
} catch (e) {
  console.error(`fix-cjk-paths: FAILED: ${e.message}`);
  process.exit(1);
}
