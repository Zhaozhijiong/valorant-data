// 全量测试 1254 个皮肤的图片 URL 解析，保存映射表
const PROXY = 'http://127.0.0.1:7897';
const { readFileSync, writeFileSync } = await import('node:fs');

const raw = JSON.parse(readFileSync('../data/api_guns_skin_ext.json', 'utf8'));
const guns = raw.data.guns;
const skins = [];
for (const g of guns) for (const s of g.skin || []) skins.push({ gun_id: g.id, gun: g.name, name: s.name, e_name: s.e_name, guid: s.guid, icon: s.icon, level: s.level, limited: s.limited });

async function resolve(s) {
  const candidates = [
    `https://media.valorant-api.com/weaponskins/${s.guid}/displayicon.png`,
    `https://media.valorant-api.com/weaponskinchromas/${s.icon}/displayicon.png`,
    `https://media.valorant-api.com/weaponskinchromas/${s.guid}/displayicon.png`,
    `https://media.valorant-api.com/weaponskins/${s.icon}/displayicon.png`,
  ];
  for (const url of candidates) {
    try {
      const r = await fetch(url, { proxy: PROXY, redirect: 'follow' });
      if (r.status === 200) return url;
    } catch { /* next */ }
  }
  return '';
}

let i = 0, done = 0, ok = 0;
const results = [];
async function worker() {
  while (i < skins.length) {
    const s = skins[i++];
    const url = await resolve(s);
    if (url) ok++;
    results.push({ gun: s.gun, name: s.name, e_name: s.e_name, guid: s.guid, icon: s.icon, level: s.level, limited: s.limited, image: url });
    done++;
    if (done % 200 === 0) console.log(`进度: ${done}/${skins.length} 成功 ${ok}`);
  }
}
await Promise.all(Array.from({ length: 12 }, () => worker()));
writeFileSync('../data/api_skin_images.json', JSON.stringify(results, null, 2));
console.log(`完成: ${skins.length} 个, 成功 ${ok}, 失败 ${skins.length - ok}`);
