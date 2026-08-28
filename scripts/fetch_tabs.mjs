const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');

const API = 'https://api.val.qq.com/go/agame/graphql/graphiQL';

async function gql(query) {
  const url = `${API}?query=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: {
      'User-Agent': 'Mozilla/5.0', 'Referer': 'https://val.qq.com/game-data.html', 'Accept': 'application/json'
    }
  });
  return resp.text();
}

const q = `{
  agent(id: 1) {
    name
    tabs {
      name
      tab_id
      content
    }
  }
}`;
const text = await gql(q);
writeFileSync('../data/api_tabs_test.json', text);
console.log(text.slice(0, 2000));
