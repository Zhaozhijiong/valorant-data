// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
// Fetch the two val.qq.com pages through the local proxy using Node's OpenSSL-based TLS
const PROXY = 'http://127.0.0.1:7897';

async function fetchViaProxy(url, outFile) {
  const { writeFileSync } = await import('node:fs');
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    },
    redirect: 'follow'
  });
  console.log(`URL: ${url}`);
  console.log(`STATUS: ${resp.status}`);
  console.log(`FINAL: ${resp.url}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(outFile, buf);
  console.log(`SAVED: ${outFile} (${buf.length} bytes)`);
  return resp;
}

const url1 = 'https://val.qq.com/game-data.html?pageType=1&&heroId=1';
const url2 = 'https://val.qq.com/act/a20250102NewUserGuide/page1_1.html';

try {
  await fetchViaProxy(url1, '../../data/page1_gamedata.html');
} catch (e) {
  console.log(`PAGE1 ERROR: ${e.message}`);
}
try {
  await fetchViaProxy(url2, '../../data/page2_newuser.html');
} catch (e) {
  console.log(`PAGE2 ERROR: ${e.message}`);
}
