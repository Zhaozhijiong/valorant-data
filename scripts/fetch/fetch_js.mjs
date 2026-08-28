// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');

async function fetchViaProxy(url, outFile, extraHeaders = {}) {
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Referer': 'https://val.qq.com/game-data.html',
      'Accept': '*/*',
      ...extraHeaders
    },
    redirect: 'follow'
  });
  console.log(`URL: ${url}`);
  console.log(`STATUS: ${resp.status} TYPE: ${resp.headers.get('content-type')}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(outFile, buf);
  console.log(`SAVED: ${outFile} (${buf.length} bytes)`);
}

await fetchViaProxy('https://val.qq.com/js/game-data.js', '../../data/js_game_data.js');
await fetchViaProxy('https://val.qq.com/js/common.js', '../../data/js_common.js');
