const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync, readFileSync } = await import('node:fs');

const API = 'https://api.val.qq.com/go/agame/graphql/graphiQL';

const detailQuery = (id) => `{
  agent(id: ${id}) {
    name
    e_name
    desc
    position_name
    skill {
      cost
      desc
      e_name
      icon
      keypad
      name
      type
      type_name
      video { vid }
    }
    contract {
      award
      experience
      icon
      level
    }
  }
}`;

async function gql(query) {
  const url = `${API}?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Referer': 'https://val.qq.com/game-data.html',
      'Accept': 'application/json'
    }
  });
  return resp.text();
}

// try tabs field on agent 1
try {
  const t = await gql(`{ agent(id: 1) { name tabs } }`);
  console.log('TABS TEST:', t.slice(0, 500));
} catch (e) { console.log('tabs err', e.message); }

// fetch all 29 agents in parallel (limit 6 concurrent)
const agents = JSON.parse(readFileSync('../data/api_agents.json', 'utf8')).data.agents;
const results = {};
let i = 0;
async function worker() {
  while (i < agents.length) {
    const a = agents[i++];
    try {
      const text = await gql(detailQuery(a.id));
      const json = JSON.parse(text);
      if (json.data && json.data.agent) {
        results[a.id] = json.data.agent;
        console.log(`OK id=${a.id} ${a.name}`);
      } else {
        console.log(`ERR id=${a.id} ${a.name}: ${text.slice(0, 200)}`);
      }
    } catch (e) {
      console.log(`FAIL id=${a.id} ${a.name}: ${e.message}`);
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);

writeFileSync('../data/api_all_agents.json', JSON.stringify(results, null, 2));
console.log('DONE, count =', Object.keys(results).length);
