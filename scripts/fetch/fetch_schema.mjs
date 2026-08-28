// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');
const API = 'https://api.val.qq.com/go/agame/graphql/graphiQL';

async function gql(query) {
  const url = `${API}?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, { proxy: PROXY, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://val.qq.com/game-data.html', 'Accept': 'application/json' } });
  return resp.text();
}

const q = `{ __type(name: "Agent") { fields { name type { kind name ofType { kind name ofType { kind name } } } } } }`;
const text = await gql(q);
writeFileSync('../../data/api_schema_agent.json', text);
console.log(text.slice(0, 4000));
