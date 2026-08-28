// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
// 解析时间线并保存为 JSON，然后批量抓取全部版本的新闻详情
const PROXY = 'http://127.0.0.1:7897';
const { readFileSync, writeFileSync } = await import('node:fs');
const { createHash } = await import('node:crypto');

const md5 = s => createHash('md5').update(s).digest('hex');

// ---------- 1) 解析时间线 ----------
const js = readFileSync('../../data/VersionTimeline.js.utf8', 'utf8');
const m = js.match(/return (\{[\s\S]*?\};)/);
const data = JSON.parse(m[1].slice(0, -1));
const entries = Object.entries(data).map(([k, v]) => ({
  key: parseInt(k),
  date: v.date,
  title: v.title,
  isMajor: v.isMajor,
  desc1: v.desc1 || '',
  desc2: v.desc2 || '',
  desc3: v.desc3 || '',
  link: v.link || '',
  docid: (v.link || '').match(/docid=(\d+)/)?.[1] || '',
}));
entries.sort((a, b) => a.key - b.key);
writeFileSync('../../data/timeline_entries.json', JSON.stringify(entries, null, 2));
console.log('时间线条目:', entries.length, '含 docid:', entries.filter(e => e.docid).length);

// ---------- 2) 批量抓取新闻详情 ----------
async function fetchNews(docid) {
  const ibiz = 329, source = 'val_gw';
  const t = parseInt(Date.now() / 1000);
  const sign = md5(source + source + ibiz + t).toLowerCase();
  const url = `https://apps.game.qq.com/cmc/complexDetail?sign=${sign}&source=${source}&ibiz=${ibiz}&subBiz=0&t=${t}&id=${docid}&detailFlag=1&status=1`;
  try {
    const resp = await fetch(url, { proxy: PROXY, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': `https://val.qq.com/newsdetails.html?docid=${docid}`, 'Accept': 'application/json' } });
    const text = await resp.text();
    const json = JSON.parse(text);
    if (json.status === 0 && json.data && json.data[0]) {
      const d = json.data[0];
      return { docid, ok: true, title: d.sTitle || '', time: d.sIdxTime || '', content: d.sContent || '' };
    }
    return { docid, ok: false, error: 'bad data' };
  } catch (e) {
    return { docid, ok: false, error: e.message };
  }
}

const withDocid = entries.filter(e => e.docid);
const results = new Map();
let i = 0, ok = 0, fail = 0;
async function worker() {
  while (i < withDocid.length) {
    const e = withDocid[i++];
    const r = await fetchNews(e.docid);
    results.set(e.docid, r);
    if (r.ok) ok++; else fail++;
    if ((ok + fail) % 15 === 0) console.log(`进度: ${ok + fail}/${withDocid.length} 成功 ${ok} 失败 ${fail}`);
  }
}
await Promise.all(Array.from({ length: 8 }, () => worker()));
console.log(`抓取完成: 成功 ${ok} 失败 ${fail}`);

const newsMap = {};
for (const [docid, r] of results) newsMap[docid] = r;
writeFileSync('../../data/news_details.json', JSON.stringify(newsMap, null, 2));
console.log('已保存 news_details.json');
