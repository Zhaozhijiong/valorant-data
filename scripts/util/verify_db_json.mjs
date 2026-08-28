// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
// 验证结构化 JSON
import { readFileSync } from 'node:fs';
const base = 'D:/zhaozhijiong/self-workspace/Valorant/data/structured/';
const v = JSON.parse(readFileSync(base + 'versions.json', 'utf8'));
const c = v[0].news.content;
console.log('实体解码 OK:', c.includes('\u201c无畏终测\u201d'));
console.log('残留实体 &ldquo;:', c.includes('&ldquo;'));
console.log('正文前 200 字:', c.slice(0, 200).replace(/\n/g, ' | '));
// 全量统计
const h = JSON.parse(readFileSync(base + 'heroes.json', 'utf8'));
const w = JSON.parse(readFileSync(base + 'weapons.json', 'utf8'));
const s = JSON.parse(readFileSync(base + 'skins.json', 'utf8'));
const t = JSON.parse(readFileSync(base + 'terms.json', 'utf8'));
console.log('\n统计:', JSON.stringify({ heroes: h.length, weapons: w.length, skins: s.length, terms: t.length, versions: v.length }));
console.log('英雄技能总数:', h.reduce((a, x) => a + x.skills.length, 0));
console.log('武器皮肤分布:', w.map(g => `${g.name}:${s.filter(sk => sk.gun_id === g.id).length}`).join(', '));
console.log('有正文的版本:', v.filter(x => x.news && x.news.content).length);
