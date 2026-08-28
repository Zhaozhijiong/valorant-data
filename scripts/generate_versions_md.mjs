// 生成版本更新汇总文档（主文档 + docs/versions/ 按版本拆分）
// 数据源: data/timeline_entries.json + data/news_details.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const entries = JSON.parse(readFileSync('../data/timeline_entries.json', 'utf8'));
const newsMap = JSON.parse(readFileSync('../data/news_details.json', 'utf8'));
const keyIdx = new Map(entries.map((e, i) => [e.key, i]));

// ---------- 工具 ----------
const safe = s => String(s).replace(/[\\/:*?"<>|]/g, '-');

// HTML -> 纯文本
function htmlToText(html) {
  if (!html) return '';
  let t = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

// 按时间线顺序推导年份：时间线按 key 排序即时间顺序，月份回退（12月->1月）即跨年
const years = [];
{
  let yr = 2023, prevMonth = 0;
  for (const e of entries) {
    const m = e.date.match(/(\d+)月/);
    const month = m ? parseInt(m[1]) : prevMonth;
    if (prevMonth && month < prevMonth) yr++;
    years.push(yr);
    prevMonth = month;
  }
}
const yearOf = (e, idx) => years[idx];

// 完整日期：年份 + 时间线日期
const fullDate = (e, idx) => {
  const y = yearOf(e, idx);
  const m = e.date.match(/(\d+)月(\d+)日/);
  if (!m) return `${y}`;
  return `${y}-${String(m[1]).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}`;
};

// 版本文件名校验
const verFileName = (e, idx) => {
  const d = fullDate(e, idx).replace(/-/g, '');
  return `${d}-${safe(e.title)}.md`;
};

// 更新要点（优先新闻正文关键行，其次时间线 desc）
function extractPoints(e) {
  const n = newsMap[e.docid];
  if (n && n.ok && n.content) {
    const text = htmlToText(n.content);
    return { text, hasDetail: true };
  }
  const descs = [e.desc1, e.desc2, e.desc3].filter(Boolean);
  return { text: descs.join('\n'), hasDetail: descs.length > 0 };
}

// ---------- 主文档 ----------
const L = [];
L.push('# 无畏契约（VALORANT）版本更新汇总');
L.push('');
L.push('> **数据来源**：');
L.push('> 1. [官方版本时间线](https://val.qq.com/act/a20250228timeline/)（`VersionTimeline.js` 数据文件，72 条）');
L.push('> 2. 各版本官方更新公告（[新闻详情页](https://val.qq.com/newsdetails.html?docid=6110935804327569671&goback=main) + 腾讯 CMC 新闻接口，64 篇正文）');
L.push('');
const majors = entries.filter(e => e.isMajor === 1);
const withDetail = entries.filter(e => newsMap[e.docid] && newsMap[e.docid].ok);
L.push(`共收录 **${entries.length}** 个版本节点（**${majors.length}** 个大版本 + ${entries.length - majors.length} 个小版本），时间跨度 **${fullDate(entries[0], 0)} ~ ${fullDate(entries[entries.length - 1], entries.length - 1)}**。其中 ${withDetail.length} 个版本有完整更新公告正文（见 [versions/](versions/) 目录）。`);
L.push('');
L.push('> 📌 说明：部分大版本（新英雄/新地图上线）的官方页面为活动页而非新闻详情，仅有时间线摘要；所有链接以官方页面为准。');
L.push('');

// 赛季大版本速览
L.push('## 赛季大版本速览');
L.push('');
L.push('| 日期 | 版本 | 要点 |');
L.push('| :--- | :--- | :--- |');
for (const e of majors) {
  const descs = [e.desc1, e.desc2, e.desc3].filter(Boolean).join('；');
  L.push(`| ${fullDate(e, keyIdx.get(e.key))} | **${e.title}** | ${descs || '-'} |`);
}
L.push('');

// 完整时间线表
L.push('## 全部版本时间线');
L.push('');
L.push('| 日期 | 版本 | 类型 | 更新要点 |');
L.push('| :--- | :--- | :---: | :--- |');
for (const e of entries) {
  const descs = [e.desc1, e.desc2, e.desc3].filter(Boolean).join('；');
  const type = e.isMajor ? '★大版本' : '小版本';
  const hasDetail = newsMap[e.docid] && newsMap[e.docid].ok;
  const link = hasDetail ? `[${e.title}](versions/${verFileName(e, keyIdx.get(e.key))})` : e.title;
  L.push(`| ${fullDate(e, keyIdx.get(e.key))} | ${link} | ${type} | ${descs || '-'} |`);
}
L.push('');

// 按版本生成详情文件
mkdirSync('../docs/versions', { recursive: true });
let detailCount = 0;
for (const e of entries) {
  const idx = keyIdx.get(e.key);
  const { text, hasDetail } = extractPoints(e);
  const P = [];
  P.push(`# ${e.title}`);
  P.push('');
  P.push(`> **日期**：${fullDate(e, idx)} ｜ **类型**：${e.isMajor ? '大版本' : '小版本'}`);
  const n = newsMap[e.docid];
  if (n && n.ok && n.time) P.push(`> **公告时间**：${n.time}`);
  P.push('');
  if (hasDetail) {
    P.push('## 更新内容');
    P.push('');
    P.push(text);
    P.push('');
  } else {
    P.push('## 更新要点');
    P.push('');
    P.push(text || '（暂无摘要）');
    P.push('');
  }
  P.push('## 相关链接');
  P.push('');
  P.push(`- [官方版本时间线](https://val.qq.com/act/a20250228timeline/)`);
  if (e.docid) P.push(`- [官方更新公告](https://val.qq.com/newsdetails.html?docid=${e.docid}&goback=news)`);
  else if (e.link) P.push(`- [官方活动页面](${e.link})`);
  P.push('');
  P.push('<!-- 后续扩展：可在此追加英雄/武器平衡详情、活动内容等 -->');
  P.push('');
  P.push('[← 返回版本更新汇总](../无畏契约版本更新汇总.md)');
  P.push('');
  writeFileSync(`../docs/versions/${verFileName(e, idx)}`, P.join('\n'), 'utf8');
  if (hasDetail) detailCount++;
}
writeFileSync('../docs/无畏契约版本更新汇总.md', L.join('\n'), 'utf8');
console.log(`主文档生成完成; 版本详情文件 ${entries.length} 个（含正文 ${detailCount} 个）`);
