// 锚定工作目录到脚本所在目录（保证相对路径与运行目录无关）
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { chdir } from 'node:process';
chdir(dirname(fileURLToPath(import.meta.url)));
// 将已收集数据按大类生成为结构化 JSON（便于导入数据库）
// 输出: data/structured/{heroes,weapons,skins,terms,versions}.json + SCHEMA.md
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const OUT = '../../data/structured';
mkdirSync(OUT, { recursive: true });

// ---------- 工具 ----------
const toNum = s => {
  if (s === undefined || s === null || s === '') return null;
  const n = Number(s);
  return isNaN(n) ? null : n;
};
const toBool = v => v === 1 || v === true || v === '1';
const skinLevelName = { 0: '标准', 1: '精选', 2: '豪华', 3: '终极', 4: '至尊' };

// ==================== 1. 英雄 heroes ====================
{
  const list = JSON.parse(readFileSync('../../data/api_agents.json', 'utf8')).data.agents;
  const extra = JSON.parse(readFileSync('../../data/api_agents_extra.json', 'utf8')).data.agents;
  const details = JSON.parse(readFileSync('../../data/api_all_agents.json', 'utf8'));
  const extraMap = new Map(extra.map(a => [a.id, a]));

  // 解析新手站关键词/简介（与 generate_md.mjs 相同逻辑）
  const html = readFileSync('../../data/page2_newuser_utf8.html', 'utf8');
  const rows = [];
  const rowRe = /<div class="hero_name"><span>([^<]+)<\/span><img[^>]*hero(\d+)\.png[^>]*><\/div><\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*>([^<]*)<\/td>\s*<td[^>]*><a href="([^"]*)"[^>]*>/g;
  let rm;
  while ((rm = rowRe.exec(html)) !== null) rows.push({ name: rm[1], keywords: rm[3], intro: rm[4], video: rm[5] });
  const newUser = new Map();
  {
    const roleOrder = ['先锋', '决斗', '控场', '哨卫'];
    const groupSizes = [7, 7, 6, 6];
    let i = 0;
    for (let g = 0; g < roleOrder.length; g++)
      for (let k = 0; k < groupSizes[g]; k++) {
        const r = rows[i++];
        newUser.set(r.name, { keywords: r.keywords, intro: r.intro, video: r.video });
      }
  }

  const heroes = list.map(a => {
    const d = details[a.id] || {};
    const e = extraMap.get(a.id) || {};
    const nu = newUser.get(a.name) || {};
    return {
      id: a.id,
      name: a.name,                                    // 中文名
      name_en: a.e_name,                               // 英文名
      role: d.position_name || null,                   // 角色定位：先锋/决斗/控场/哨卫
      role_position: e.position_desc || null,          // 位置：信息位/突击位/烟位/防守位
      nationality: e.nationality || null,              // 国籍
      icon: a.icon || null,                            // 头像 URL
      keywords: nu.keywords ? nu.keywords.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [], // 关键词列表
      description: d.desc || null,                     // 英雄描述（官方）
      intro: nu.intro || null,                         // 新手简介
      intro_video: nu.video || null,                   // 新手站介绍视频
      skills: (d.skill || []).map(s => ({
        keypad: s.keypad || null,                      // 键位 C/Q/E/X
        name: s.name || null,                          // 技能名
        name_en: s.e_name || null,                     // 技能英文名
        type: s.type_name || null,                     // 类型：基础/招牌/终极
        type_id: s.type ?? null,                       // 类型数值
        cost_text: s.cost || null,                     // 价格原文
        cost: s.cost ? (s.cost === '免费' ? 0 : toNum(s.cost)) : null, // 价格数值
        description: s.desc || null,                   // 技能描述
        icon: s.icon || null,                          // 技能图标
        video_id: (s.video && s.video.vid) || null,    // 演示视频 ID
      })),
    };
  });
  heroes.sort((a, b) => a.id - b.id);
  writeFileSync(`${OUT}/heroes.json`, JSON.stringify(heroes, null, 2));
  console.log(`heroes.json: ${heroes.length} 条`);
}

// ==================== 2. 武器 weapons ====================
{
  const guns = JSON.parse(readFileSync('../../data/api_guns_full.json', 'utf8')).data.guns;
  const weapons = guns.map(g => ({
    id: g.id,
    name: g.name,                                      // 中文名
    name_en: g.e_name,                                 // 英文名
    type: g.type_name || null,                         // 枪械类型：佩枪/冲锋枪/...
    price_text: g.price || null,                       // 价格原文（含"免费"）
    price: g.price === '免费' ? 0 : toNum(g.price),    // 价格数值
    magazine: g.cli_size ?? null,                      // 弹匣容量
    penetration: g.penetration_name || null,           // 穿透等级：低/中/高
    fire_mode: g.main_firing_mode || null,             // 开火模式：全自动/半自动
    stats: {                                           // 属性（数值）
      firing_speed: toNum(g.firing_speed),             // 射速
      equipping_speed: toNum(g.equipping_speed),       // 换枪速度
      loading_speed: toNum(g.loading_speed),           // 换弹速度
      moving_speed: toNum(g.moving_speed),             // 移动速度
      trajectory_deflection: toNum(g.trajectory_deflection),   // 弹道偏移
      sup_trajectory_deflection: toNum(g.sup_trajectory_deflection), // 开镜弹道偏移
    },
    damage: (g.damage || []).map(d => ({               // 伤害（按距离分段）
      distance: d.distance || null,
      head: d.head ?? null,
      body: d.body ?? null,
      leg: d.leg ?? null,
    })),
    description: (g.desc || '').replace(/\n{2,}/g, '\n\n').trim() || null, // 武器描述
    icon: g.icon || null,                              // 图标 URL
  }));
  weapons.sort((a, b) => a.id - b.id);
  writeFileSync(`${OUT}/weapons.json`, JSON.stringify(weapons, null, 2));
  console.log(`weapons.json: ${weapons.length} 条`);
}

// ==================== 3. 皮肤 skins ====================
{
  const guns = JSON.parse(readFileSync('../../data/api_guns_full.json', 'utf8')).data.guns;
  let imgMap = new Map();
  try {
    const imgs = JSON.parse(readFileSync('../../data/api_skin_images.json', 'utf8'));
    for (const s of imgs) imgMap.set(s.guid, s.image);
  } catch { /* 无图片映射时 image_url 为空 */ }

  const skins = [];
  for (const g of guns) {
    for (const s of (g.skin || []).filter(x => x && x.name && x.name !== '从个人最爱中随机选择')) {
      skins.push({
        guid: s.guid || null,                          // 皮肤 UUID（主键）
        gun_id: g.id,                                  // 所属武器 ID（外键 -> weapons.id）
        name: s.name || null,                          // 中文皮肤名
        name_en: s.e_name || null,                     // 英文皮肤名
        level: s.level ?? null,                        // 品质等级 0-4
        level_name: skinLevelName[s.level] || null,    // 品质名：标准/精选/豪华/终极/至尊
        limited: toBool(s.limited),                    // 是否限定
        icon_uuid: s.icon || null,                     // 图标 UUID（chroma 变体用）
        primary_asset: s.primary_asset || null,        // UE 资源路径
        image_url: imgMap.get(s.guid) || null,         // 可展示图片 URL
      });
    }
  }
  writeFileSync(`${OUT}/skins.json`, JSON.stringify(skins, null, 2));
  console.log(`skins.json: ${skins.length} 条`);
}

// ==================== 4. 术语 terms ====================
{
  const html = readFileSync('../../data/page2_newuser_page2_utf8.html', 'utf8');
  const CATS = [
    { name: '战术术语', range: [1, 11] }, { name: '交流术语', range: [12, 20] },
    { name: '操作术语', range: [21, 27] }, { name: '地图通用术语', range: [28, 33] },
    { name: '亚海悬城', range: [34, 42] }, { name: '莲华古城', range: [43, 47] },
    { name: '裂变峡谷', range: [48, 52] }, { name: '森寒冬港', range: [53, 57] },
    { name: '深海明珠', range: [58, 65] }, { name: '微风岛屿', range: [66, 67] },
    { name: '隐士修所', range: [68, 69] }, { name: '源工重镇', range: [70, 73] },
    { name: '日落之城', range: [74, 77] }, { name: '霓虹町', range: [78, 83] },
    { name: '幽邃地窟', range: [84, 92] },
  ];
  const catOf = new Map();
  for (const c of CATS) for (let i = c.range[0]; i <= c.range[1]; i++) catOf.set(i, c.name);

  const terms = [];
  const chunks = html.split('<div class="term_wrapper"').slice(1);
  for (const chunk of chunks) {
    const idM = chunk.match(/data-term-id="(\d+)"/);
    if (!idM) continue;
    const id = parseInt(idM[1]);
    const nameM = chunk.match(/<span class="term_name">([\s\S]*?)<\/span>/);
    const desM = chunk.match(/<div class="term_des">([\s\S]*?)<\/div>/);
    const imgM = chunk.match(/<img src="([^"]+)"/g);
    const videoM = chunk.match(/id="(term_id\d+)"/);
    const fullUrl = u => (u || '').startsWith('//') ? 'https:' + u : u;
    terms.push({
      id,                                             // 术语 ID（官方 data-term-id）
      category: catOf.get(id) || null,                // 分类/所属地图
      name: nameM ? nameM[1].trim() : null,           // 术语名
      description: desM ? desM[1].trim().replace(/\s+/g, ' ') : null, // 解释（地图点位术语多为 null）
      images: imgM ? imgM.map(s => fullUrl(s.match(/src="([^"]+)"/)[1])) : [], // 插图
      video_id: videoM ? videoM[1] : null,            // 演示视频占位 ID
    });
  }
  terms.sort((a, b) => a.id - b.id);
  writeFileSync(`${OUT}/terms.json`, JSON.stringify(terms, null, 2));
  console.log(`terms.json: ${terms.length} 条`);
}

// ==================== 5. 版本 versions ====================
{
  const entries = JSON.parse(readFileSync('../../data/timeline_entries.json', 'utf8'));
  const newsMap = JSON.parse(readFileSync('../../data/news_details.json', 'utf8'));
  const keyIdx = new Map(entries.map((e, i) => [e.key, i]));

  // 推导年份（与 generate_versions_md.mjs 相同逻辑）
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
  const fullDate = (e, idx) => {
    const m = e.date.match(/(\d+)月(\d+)日/);
    return m ? `${years[idx]}-${String(m[1]).padStart(2, '0')}-${String(m[2]).padStart(2, '0')}` : `${years[idx]}`;
  };
  const htmlToText = html => {
    if (!html) return '';
    const entities = {
      '&ldquo;': '“', '&rdquo;': '”', '&lsquo;': '‘', '&rsquo;': '’',
      '&middot;': '·', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…',
      '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&lt;': '<', '&gt;': '>',
      '&#39;': "'", '&apos;': "'",
    };
    let t = html
      .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<p[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '');
    for (const [k, v] of Object.entries(entities)) t = t.split(k).join(v);
    return t.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  };

  const versions = entries.map((e, idx) => {
    const n = newsMap[e.docid];
    return {
      id: e.key,                                       // 时间线节点 ID
      date: fullDate(e, idx),                          // 更新日期 YYYY-MM-DD
      year: years[idx],                                // 年份
      title: e.title,                                  // 版本名/标题
      is_major: e.isMajor === 1,                       // 是否大版本
      highlights: [e.desc1, e.desc2, e.desc3].filter(Boolean), // 更新要点
      docid: e.docid || null,                          // 新闻 docid（外键 -> news）
      link: e.link || null,                            // 官方链接
      news: n && n.ok ? {                              // 完整更新公告
        title: n.title || null,
        publish_time: n.time || null,
        content: htmlToText(n.content),                // 纯文本正文
        content_html: n.content || null,               // 原始 HTML 正文
      } : null,
    };
  });
  writeFileSync(`${OUT}/versions.json`, JSON.stringify(versions, null, 2));
  console.log(`versions.json: ${versions.length} 条`);
}

console.log('全部结构化 JSON 已生成到', OUT);
