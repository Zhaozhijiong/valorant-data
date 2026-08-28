const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');

const API = 'https://api.val.qq.com/go/agame/graphql/graphiQL';

async function gql(query, label) {
  const url = `${API}?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      'Referer': 'https://val.qq.com/game-data.html',
      'Accept': 'application/json'
    }
  });
  const text = await resp.text();
  console.log(`[${label}] STATUS: ${resp.status} LEN: ${text.length}`);
  writeFileSync(`../data/api_${label}.json`, text);
  return text;
}

// 1) Hero list
const listQuery = `{
  agents {
    id
    name
    e_name
    icon
  }
}`;
await gql(listQuery, 'agents');

// 2) Try a rich detail query including possible keyword fields
const detailQuery = `{
  agent(id: 1) {
    name
    e_name
    desc
    position_name
    keyword
    keywords
    tags
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
await gql(detailQuery, 'agent1_rich');
