// 重新抓取全部枪械完整字段（含皮肤 guid/limited/primary_asset）
const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');
const API = 'https://api.val.qq.com/go/agame/graphql/graphiQL';

const query = `{
  guns {
    id
    name
    e_name
    icon
    desc
    cli_size
    type_name
    price
    firing_speed
    equipping_speed
    loading_speed
    moving_speed
    trajectory_deflection
    main_firing_mode
    penetration_name
    sup_trajectory_deflection
    damage { body distance head leg }
    skin { name e_name icon guid level limited primary_asset }
  }
}`;

const url = `${API}?query=${encodeURIComponent(query)}`;
const resp = await fetch(url, {
  proxy: PROXY,
  headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://val.qq.com/game-data.html?pageType=2', 'Accept': 'application/json' }
});
const text = await resp.text();
writeFileSync('../data/api_guns_full.json', text);
const json = JSON.parse(text);
console.log('STATUS:', resp.status, 'GUNS:', json.data.guns.length);
const sample = json.data.guns[0].skin[0];
console.log('sample skin:', JSON.stringify(sample));
