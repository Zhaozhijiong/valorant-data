// 通过 CMC 新闻 API 抓取新闻详情（common.js 的 readerNews 逻辑）
const PROXY = 'http://127.0.0.1:7897';
const { writeFileSync } = await import('node:fs');
const { createHash } = await import('node:crypto');

const md5 = s => createHash('md5').update(s).digest('hex');

async function fetchNews(docid, outFile) {
  const ibiz = 329;
  const source = 'val_gw';
  const t = parseInt(Date.now() / 1000);
  const sign = md5(source + source + ibiz + t).toLowerCase();
  const url = `https://apps.game.qq.com/cmc/complexDetail?sign=${sign}&source=${source}&ibiz=${ibiz}&subBiz=0&t=${t}&id=${docid}&detailFlag=1&status=1`;
  const resp = await fetch(url, {
    proxy: PROXY,
    headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': `https://val.qq.com/newsdetails.html?docid=${docid}`, 'Accept': 'application/json' }
  });
  const text = await resp.text();
  writeFileSync(outFile, text);
  console.log(`docid=${docid} STATUS ${resp.status} LEN ${text.length}`);
  return text;
}

await fetchNews('6110935804327569671', '../data/news_v12.11.json');
