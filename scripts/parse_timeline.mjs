// 解析 VersionTimeline.js 并输出条目清单
import { readFileSync } from 'node:fs';

const js = readFileSync('../data/VersionTimeline.js.utf8', 'utf8');
// 稳健提取 return {...}; 对象字面量
const m = js.match(/return (\{[\s\S]*?\};)/);
if (!m) { console.error('未找到时间线对象'); process.exit(1); }
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
  pic: v.pic || '',
}));
entries.sort((a, b) => a.key - b.key);

console.log('总条目数:', entries.length);
console.log('大版本(isMajor=1):', entries.filter(e => e.isMajor === 1).length);
console.log('小版本(isMajor=0):', entries.filter(e => e.isMajor === 0).length);
console.log('');
for (const e of entries) {
  const descs = [e.desc1, e.desc2, e.desc3].filter(Boolean).join(' / ');
  console.log(`[${String(e.key).padStart(2)}] ${e.date} | ${e.title} | ${e.isMajor ? '★大版本' : '小版本'} | ${descs} | docid=${e.docid}`);
}
