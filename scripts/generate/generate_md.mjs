// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
// 合并数据源并生成 Markdown（v2：总览按ID排序，详情按角色分组）
// 数据源1: api_agents.json - 英雄列表 (id, name, e_name, icon)
// 数据源2: api_agents_extra.json - 英雄扩展 (nationality, position_desc)
// 数据源3: api_all_agents.json - 英雄详情 (desc, position_name, skill[])
// 数据源4: page2_newuser_utf8.html - 新手站 (关键词, 简介, 角色分组)

import { readFileSync, writeFileSync } from 'node:fs';

// ---------- 解析新手站 HTML ----------
const html = readFileSync('../../data/page2_newuser_utf8.html', 'utf8');

const rows = [];
const rowRe = /<div class="hero_name"><span>([^<]+)<\/span><img[^>]*hero(\d+)\.png[^>]*><\/div><\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*><a href="([^"]*)"[^>]*>/g;
let rm;
while ((rm = rowRe.exec(html)) !== null) {
  rows.push({ name: rm[1], imgNo: parseInt(rm[2]), keywords: rm[3], intro: rm[4], video: rm[5] });
}

// 分组映射（按新手站顺序）: 先锋7 + 决斗7 + 控场6 + 哨卫6 = 26
const roleOrder = ['先锋', '决斗', '控场', '哨卫'];
const groupSizes = [7, 7, 6, 6];
let rowIdx = 0;
const newUser = new Map();
for (let g = 0; g < roleOrder.length; g++) {
  for (let k = 0; k < groupSizes[g]; k++) {
    const r = rows[rowIdx++];
    newUser.set(r.name, { role: roleOrder[g], keywords: r.keywords, intro: r.intro, video: r.video });
  }
}
console.log('新手站英雄数:', newUser.size);

// ---------- 加载 API 数据 ----------
const list = JSON.parse(readFileSync('../../data/api_agents.json', 'utf8')).data.agents;
const extra = JSON.parse(readFileSync('../../data/api_agents_extra.json', 'utf8')).data.agents;
const details = JSON.parse(readFileSync('../../data/api_all_agents.json', 'utf8'));
const extraMap = new Map(extra.map(a => [a.id, a]));

const heroes = list.map(a => {
  const d = details[a.id];
  const e = extraMap.get(a.id);
  const nu = newUser.get(a.name) || {};
  return {
    id: a.id,
    name: a.name,
    e_name: a.e_name,
    icon: a.icon,
    position_name: d ? d.position_name : '',
    position_desc: e ? e.position_desc : '',
    nationality: e ? e.nationality : '',
    desc: d ? d.desc : '',
    keywords: nu.keywords || '',
    intro: nu.intro || '',
    video: nu.video || '',
    skills: d ? d.skill : []
  };
});

// 按 API id 排序（即上线顺序）
heroes.sort((x, y) => x.id - y.id);

// ---------- 工具函数 ----------
const safe = s => String(s).replace(/[\\/:*?"<>|]/g, '-');
const heroFileName = h => `${String(h.id).padStart(2, '0')}-${safe(h.name)}-${safe(h.e_name)}.md`;

// ---------- 生成单个英雄文件 ----------
function renderHero(h) {
  const P = [];
  P.push(`# ${h.name}（${h.e_name}）`);
  P.push('');
  P.push(`> **编号**：${h.id} ｜ **角色定位**：${h.position_name || '-'}（${h.position_desc || '-'}） ｜ **国籍**：${h.nationality || '-'}`);
  P.push('');
  if (h.icon) {
    P.push(`![${h.name} 图标](${h.icon})`);
    P.push('');
  }
  P.push('## 基本信息');
  P.push('');
  P.push('| 属性 | 内容 |');
  P.push('| :--- | :--- |');
  P.push(`| 编号 | ${h.id} |`);
  P.push(`| 中文名 | ${h.name} |`);
  P.push(`| 英文名 | ${h.e_name} |`);
  P.push(`| 角色定位 | ${h.position_name || '-'}（${h.position_desc || '-'}） |`);
  P.push(`| 国籍 | ${h.nationality || '-'} |`);
  P.push(`| 关键词 | ${h.keywords || '-'} |`);
  if (h.video) P.push(`| 介绍视频 | [点击观看](${h.video}) |`);
  P.push('');
  P.push('## 英雄描述');
  P.push('');
  P.push(h.desc || '（暂无）');
  P.push('');
  if (h.intro) {
    P.push('## 新手简介');
    P.push('');
    P.push(h.intro);
    P.push('');
  }
  P.push('## 技能介绍');
  P.push('');
  if (h.skills && h.skills.length) {
    P.push('| 键位 | 技能名称 | 类型 | 价格 | 技能描述 |');
    P.push('| :---: | :--- | :--- | :---: | :--- |');
    for (const s of h.skills) {
      P.push(`| ${s.keypad || '-'} | ${s.name || '-'} | ${s.type_name || '-'} | ${s.cost || '-'} | ${s.desc || '-'} |`);
    }
  } else {
    P.push('（暂无技能数据）');
  }
  P.push('');
  P.push('## 相关链接');
  P.push('');
  P.push(`- [官网英雄数据页](https://val.qq.com/game-data.html?pageType=1&&heroId=${h.id})`);
  if (h.video) P.push(`- [新手站介绍视频](${h.video})`);
  P.push('');
  P.push('<!-- 后续扩展：可在此追加英雄攻略、皮肤、背景故事、契约奖励等内容 -->');
  P.push('');
  P.push(`[← 返回英雄总览](../无畏契约英雄数据汇总.md)`);
  P.push('');
  return P.join('\n');
}

// ---------- 生成主文档 ----------
const L = [];
L.push('# 无畏契约（VALORANT）英雄数据汇总');
L.push('');
L.push('> **数据来源**：');
L.push('> 1. [游戏资料-英雄数据页](https://val.qq.com/game-data.html?pageType=1&&heroId=1) —— 页面由 JS 动态渲染，数据来自官方 GraphQL API `https://api.val.qq.com/go/agame/graphql/graphiQL`（英雄名称、角色定位、英雄描述、技能介绍）');
L.push('> 2. [官方新手站-英雄介绍](https://val.qq.com/act/a20250102NewUserGuide/page1_1.html) —— 英雄关键词、新手简介、角色分组');
L.push('');
L.push(`共收录 **${heroes.length}** 位英雄（截至 ${new Date().toISOString().slice(0, 10)}，按官方 API 顺序编号）。每位英雄的完整数据见 [heroes/](heroes/) 目录下的独立文件。`);
L.push('');
L.push('> 📌 说明：编号 1–26 的英雄在官方新手站有「关键词」与「新手简介」；编号 27–29（幻棱、禁灭、迷核）发布于新手站之后，暂无关键词/新手简介数据。');
L.push('');

// 角色分布
const roleCount = {};
for (const h of heroes) {
  const r = h.position_name || '未分类';
  roleCount[r] = (roleCount[r] || 0) + 1;
}
L.push('## 角色分布');
L.push('');
for (const r of roleOrder) if (roleCount[r]) L.push(`- **${r}**：${roleCount[r]} 位`);
for (const [r, c] of Object.entries(roleCount)) if (!roleOrder.includes(r)) L.push(`- ${r}：${c} 位`);
L.push('');

// 总览表（英雄列带链接）
L.push('## 英雄总览');
L.push('');
L.push('| 编号 | 英雄 | 英文名 | 角色定位 | 位置 | 国籍 | 关键词 |');
L.push('| :---: | :--- | :--- | :--- | :--- | :--- | :--- |');
for (const h of heroes) {
  L.push(`| ${h.id} | [${h.name}](heroes/${heroFileName(h)}) | ${h.e_name} | ${h.position_name || '-'} | ${h.position_desc || '-'} | ${h.nationality || '-'} | ${h.keywords || '-'} |`);
}
L.push('');

// 英雄索引（按角色分组）
L.push('## 英雄索引');
L.push('');
L.push('> 点击英雄名跳转至对应详情文件。');
L.push('');
for (const role of roleOrder) {
  const group = heroes.filter(h => h.position_name === role);
  if (!group.length) continue;
  L.push(`### ${role}`);
  L.push('');
  for (const h of group) {
    L.push(`- **${h.id}.** [${h.name}（${h.e_name}）](heroes/${heroFileName(h)})`);
  }
  L.push('');
}

// ---------- 写文件 ----------
import { mkdirSync } from 'node:fs';
mkdirSync('../../docs/heroes', { recursive: true });
let heroCount = 0;
for (const h of heroes) {
  writeFileSync(`../../docs/heroes/${heroFileName(h)}`, renderHero(h), 'utf8');
  heroCount++;
}
writeFileSync('../../docs/无畏契约英雄数据汇总.md', L.join('\n'), 'utf8');
console.log(`主文档生成完成, 英雄文件数: ${heroCount}, 主文档长度: ${L.join('\n').length}`);
