const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');
const API = 'https://api.val.qq.com/go/agame/graphql/graphiQL';

async function fetchViaProxy(url, outFile) {
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36', 'Referer': 'https://val.qq.com/game-data.html?pageType=2', 'Accept': '*/*' },
    redirect: 'follow'
  });
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(outFile, buf);
  console.log(`SAVED ${outFile} (${buf.length} bytes) STATUS ${resp.status}`);
}

async function gql(query, outFile) {
  const url = `${API}?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, { proxy: PROXY, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://val.qq.com/game-data.html?pageType=2', 'Accept': 'application/json' } });
  const text = await resp.text();
  writeFileSync(outFile, text);
  console.log(`SAVED ${outFile} (${text.length} bytes) STATUS ${resp.status}`);
  return text;
}

// 1) pageType=2 页面
await fetchViaProxy('https://val.qq.com/game-data.html?pageType=2', '../data/page1_gamedata_p2.html');

// 2) guns 列表
await gql(`{ guns { id name e_name icon } }`, '../data/api_guns.json');

// 3) Gun 类型 schema（发现所有可用字段）
await gql(`{ __type(name: "Gun") { fields { name type { kind name ofType { kind name ofType { kind name } } } } } }`, '../data/api_schema_gun.json');

// 4) 单个枪械详情（rich）
await gql(`{
  gun(id: 1) {
    name e_name icon desc cli_size type_name price firing_speed equipping_speed loading_speed
    moving_speed trajectory_deflection main_firing_mode penetration_name sup_trajectory_deflection
    damage { body distance head leg }
    skin { e_name icon level name }
  }
}`, '../data/api_gun1_rich.json');
