// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
// 解析新手站 page2.html 术语科普数据，生成术语文档
// 数据源: data/page2_newuser_page2_utf8.html
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('../../data/page2_newuser_page2_utf8.html', 'utf8');

// 分类定义（按官方顺序）
const CATS = [
  { id: 'tactic', name: '战术术语', range: [1, 11] },
  { id: 'comm', name: '交流术语', range: [12, 20] },
  { id: 'oper', name: '操作术语', range: [21, 27] },
  { id: 'mapgen', name: '地图通用术语', range: [28, 33] },
  { id: 'map_ascent', name: '亚海悬城', range: [34, 42] },
  { id: 'map_lotus', name: '莲华古城', range: [43, 47] },
  { id: 'map_fracture', name: '裂变峡谷', range: [48, 52] },
  { id: 'map_icebox', name: '森寒冬港', range: [53, 57] },
  { id: 'map_pearl', name: '深海明珠', range: [58, 65] },
  { id: 'map_breeze', name: '微风岛屿', range: [66, 67] },
  { id: 'map_haven', name: '隐士修所', range: [68, 69] },
  { id: 'map_bind', name: '源工重镇', range: [70, 73] },
  { id: 'map_sunset', name: '日落之城', range: [74, 77] },
  { id: 'map_neon', name: '霓虹町', range: [78, 83] },
  { id: 'map_abyss', name: '幽邃地窟', range: [84, 92] },
];

// 解析所有 term_wrapper 块（按块分割，兼容不同嵌套结构）
const terms = new Map();
const chunks = html.split('<div class="term_wrapper"').slice(1);
for (const chunk of chunks) {
  const idM = chunk.match(/data-term-id="(\d+)"/);
  if (!idM) continue;
  const id = parseInt(idM[1]);
  const nameM = chunk.match(/<span class="term_name">([\s\S]*?)<\/span>/);
  const desM = chunk.match(/<div class="term_des">([\s\S]*?)<\/div>/);
  const imgM = chunk.match(/<img src="([^"]+)"/g);
  const imgs = imgM ? imgM.map(s => s.match(/src="([^"]+)"/)[1]) : [];
  const videoM = chunk.match(/id="(term_id\d+)"/);
  terms.set(id, {
    id,
    name: nameM ? nameM[1].trim() : '',
    desc: desM ? desM[1].trim().replace(/\s+/g, ' ') : '',
    imgs,
    video: videoM ? videoM[1] : '',
  });
}
console.log('解析到术语数:', terms.size);

// 归类
const groups = CATS.map(c => ({
  ...c,
  terms: [...Array(c.range[1] - c.range[0] + 1).keys()].map(i => i + c.range[0])
    .map(id => terms.get(id)).filter(Boolean),
}));
const total = groups.reduce((s, g) => s + g.terms.length, 0);
console.log('总术语数:', total);
const withDesc = [...terms.values()].filter(t => t.desc).length;
const withImg = [...terms.values()].filter(t => t.imgs.length).length;
console.log(`有文字解释: ${withDesc}, 有图片: ${withImg}`);

// 图片补全协议相对地址
const fullUrl = u => u.startsWith('//') ? 'https:' + u : u;

// ---------- 生成文档 ----------
const L = [];
L.push('# 无畏契约（VALORANT）术语汇总');
L.push('');
L.push('> **数据来源**：[官方新手站-战术进阶-术语科普](https://val.qq.com/act/a20250102NewUserGuide/page2.html)（术语解释与插图均为官方原文）。');
L.push('');
L.push(`共收录 **${total}** 条术语：**战术术语**、**交流术语**、**操作术语**、**地图通用术语**（共 33 条，含文字解释），以及 **${groups.filter(g => g.id.startsWith('map_')).reduce((s, g) => s + g.terms.length, 0)} 条地图特殊点位术语**（11 张地图，以插图示意为主）。`);
L.push('');

// 速查索引
L.push('## 术语速查');
L.push('');
for (const g of groups) {
  L.push(`- **${g.name}**：${g.terms.map(t => `\`${t.name}\``).join('、')}`);
}
L.push('');

// 通用术语详情（带解释）
L.push('## 通用术语详解');
L.push('');
for (const g of groups.slice(0, 4)) {
  L.push(`### ${g.name}`);
  L.push('');
  for (const t of g.terms) {
    L.push(`#### ${t.name}`);
    L.push('');
    if (t.desc) L.push(t.desc);
    if (t.video) L.push('');
    if (t.video) L.push(`> 官方演示视频：\`${t.video}\``);
    if (t.imgs.length) {
      L.push('');
      for (const img of t.imgs) L.push(`![${t.name}](${fullUrl(img)})`);
    }
    L.push('');
  }
}

// 地图特殊术语
L.push('## 地图特殊点位术语');
L.push('');
L.push('> 地图点位术语以插图示意为主（部分地图为占位图），用于约定俗称的报点称呼。');
L.push('');
for (const g of groups.slice(4)) {
  L.push(`### ${g.name}`);
  L.push('');
  L.push('| 术语 | 插图 |');
  L.push('| :--- | :--- |');
  for (const t of g.terms) {
    const imgCell = t.imgs.length
      ? t.imgs.map(img => `[![${t.name}](${fullUrl(img)})](${fullUrl(img)})`).join(' ')
      : '-';
    L.push(`| ${t.name} | ${imgCell} |`);
  }
  L.push('');
}

writeFileSync('../../docs/无畏契约术语汇总.md', L.join('\n'), 'utf8');
console.log('术语文档生成完成, 长度:', L.join('\n').length);
