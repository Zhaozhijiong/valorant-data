// 抓取新手站 page2.html（战术进阶-术语科普），经本机代理
// 输出: ../data/page2_newuser_page2.html (GBK 原始)
// 转码: 用 PowerShell 或文本编辑器将 GBK 转 UTF-8 后保存为 page2_newuser_page2_utf8.html
const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');

const url = 'https://val.qq.com/act/a20250102NewUserGuide/page2.html';
const resp = await fetch(url, {
  proxy: PROXY,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36', 'Accept': 'text/html' },
  redirect: 'follow'
});
const buf = Buffer.from(await resp.arrayBuffer());
writeFileSync('../data/page2_newuser_page2.html', buf);
console.log(`SAVED ../data/page2_newuser_page2.html (${buf.length} bytes) STATUS ${resp.status}`);
