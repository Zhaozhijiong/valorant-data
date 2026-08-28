// 生成武器数据文档（主文档 + 按枪械拆分）
// 数据源: data/api_guns_full.json (GraphQL guns 完整字段)
//         data/api_skin_images.json (皮肤图片 URL 映射，由 resolve_skin_images.mjs 生成)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const raw = JSON.parse(readFileSync('../data/api_guns_full.json', 'utf8'));
const guns = raw.data.guns;
guns.sort((a, b) => a.id - b.id);

// 皮肤图片映射（guid -> image url）
let skinImages = new Map();
try {
  const imgs = JSON.parse(readFileSync('../data/api_skin_images.json', 'utf8'));
  for (const s of imgs) skinImages.set(s.guid, s.image);
  console.log('皮肤图片映射已加载:', skinImages.size, '条');
} catch (e) {
  console.log('警告: 未找到皮肤图片映射, 将不显示皮肤图片:', e.message);
}

const safe = s => String(s).replace(/[\\/:*?"<>|]/g, '-');
const gunFileName = g => `${String(g.id).padStart(2, '0')}-${safe(g.name)}-${safe(g.e_name)}.md`;

// 皮肤等级说明
const skinLevelDesc = { 0: '标准', 1: '精选', 2: '豪华', 3: '终极', 4: '至尊' };

// 描述文本规范化：换行 -> 段落
const normDesc = s => (s || '').replace(/\n{2,}/g, '\n\n').replace(/\n/g, '\n\n').trim();

// ---------- 单个枪械文件 ----------
function renderGun(g) {
  const P = [];
  P.push(`# ${g.name}（${g.e_name}）`);
  P.push('');
  P.push(`> **编号**：${g.id} ｜ **类型**：${g.type_name || '-'} ｜ **价格**：${g.price || '-'}`);
  P.push('');
  if (g.icon) { P.push(`![${g.name} 图标](${g.icon})`); P.push(''); }

  P.push('## 基本信息');
  P.push('');
  P.push('| 属性 | 内容 |');
  P.push('| :--- | :--- |');
  P.push(`| 编号 | ${g.id} |`);
  P.push(`| 中文名 | ${g.name} |`);
  P.push(`| 英文名 | ${g.e_name} |`);
  P.push(`| 枪械类型 | ${g.type_name || '-'} |`);
  P.push(`| 价格 | ${g.price || '-'} |`);
  P.push(`| 弹匣容量 | ${g.cli_size ?? '-'} |`);
  P.push(`| 穿透等级 | ${g.penetration_name || '-'} |`);
  P.push(`| 开火模式 | ${g.main_firing_mode || '-'} |`);
  P.push('');

  P.push('## 属性数据');
  P.push('');
  P.push('| 射速 | 换枪速度 | 换弹速度 | 移动速度 | 弹道偏移 | 开镜弹道偏移 |');
  P.push('| :---: | :---: | :---: | :---: | :---: | :---: |');
  P.push(`| ${g.firing_speed || '-'} | ${g.equipping_speed || '-'} | ${g.loading_speed || '-'} | ${g.moving_speed || '-'} | ${g.trajectory_deflection || '-'} | ${g.sup_trajectory_deflection || '-'} |`);
  P.push('');

  P.push('## 伤害数据');
  P.push('');
  if (g.damage && g.damage.length) {
    P.push('| 距离 | 头部 | 身体 | 腿部 |');
    P.push('| :---: | :---: | :---: | :---: |');
    for (const d of g.damage) {
      P.push(`| ${d.distance || '--'} | ${d.head ?? '-'} | ${d.body ?? '-'} | ${d.leg ?? '-'} |`);
    }
  } else {
    P.push('（暂无伤害数据）');
  }
  P.push('');

  const desc = normDesc(g.desc);
  if (desc) {
    P.push('## 武器描述');
    P.push('');
    P.push(desc);
    P.push('');
  }

  const skins = (g.skin || []).filter(s => s && s.name && s.name !== '从个人最爱中随机选择');
  const skinTotal = skins.length;
  const limitedCount = skins.filter(s => s.limited === 1).length;
  P.push(`## 皮肤（${skinTotal} 款${limitedCount ? `，限定 ${limitedCount} 款` : ''}）`);
  P.push('');
  if (skins.length) {
    P.push('> 皮肤等级：0=标准，1=精选，2=豪华，3=终极，4=至尊；图片来自 media.valorant-api.com（按官方皮肤 UUID 解析）。');
    P.push('');
    P.push('| 图片 | 皮肤名称 | 英文名 | 等级 | 限定 |');
    P.push('| :--- | :--- | :--- | :---: | :---: |');
    for (const s of skins) {
      const img = skinImages.get(s.guid) || '';
      const cell = img ? `[![${s.name}](${img})](${img})` : '-';
      P.push(`| ${cell} | ${s.name || '-'} | ${s.e_name || '-'} | ${s.level ?? '-'}${skinLevelDesc[s.level] ? '（' + skinLevelDesc[s.level] + '）' : ''} | ${s.limited === 1 ? '是' : '否'} |`);
    }
  } else {
    P.push('（暂无皮肤数据）');
  }
  P.push('');

  P.push('## 相关链接');
  P.push('');
  P.push('- [官网枪械数据页](https://val.qq.com/game-data.html?pageType=2)');
  P.push('');
  P.push('<!-- 后续扩展：可在此追加皮肤详情、弹道视频、使用攻略等内容 -->');
  P.push('');
  P.push('[← 返回武器总览](../无畏契约武器数据汇总.md)');
  P.push('');
  return P.join('\n');
}

// ---------- 主文档 ----------
const L = [];
L.push('# 无畏契约（VALORANT）武器数据汇总');
L.push('');
L.push('> **数据来源**：');
L.push('> [游戏资料-枪械数据页](https://val.qq.com/game-data.html?pageType=2) —— 页面由 JS 动态渲染，数据来自官方 GraphQL API `https://api.val.qq.com/go/agame/graphql/graphiQL`（`guns` / `gun(id)` 查询，含伤害、属性、皮肤等完整字段）。');
L.push('');
L.push(`共收录 **${guns.length}** 把枪械（截至 ${new Date().toISOString().slice(0, 10)}，按官方 API 顺序编号）。每位武器的完整数据见 [guns/](guns/) 目录下的独立文件。`);
L.push('');
L.push('> 📌 说明：官方枪械数据不含近战武器；编号按官方 API 顺序。');
L.push('');

// 分类统计
const typeCount = {};
const typeOrder = [];
for (const g of guns) {
  const t = g.type_name || '未知';
  if (!typeCount[t]) { typeCount[t] = 0; typeOrder.push(t); }
  typeCount[t]++;
}
L.push('## 分类统计');
L.push('');
for (const t of typeOrder) L.push(`- **${t}**：${typeCount[t]} 把`);
L.push('');

// 皮肤数据总览
const allSkins = guns.flatMap(g => (g.skin || []).filter(s => s && s.name && s.name !== '从个人最爱中随机选择'));
const lvDist = {};
for (const s of allSkins) lvDist[s.level] = (lvDist[s.level] || 0) + 1;
const limitedTotal = allSkins.filter(s => s.limited === 1).length;
L.push('## 皮肤数据总览');
L.push('');
L.push(`- **皮肤总数**：${allSkins.length} 款（含限定 ${limitedTotal} 款）`);
L.push(`- **等级分布**：` + Object.keys(lvDist).sort((a, b) => a - b).map(k => `等级 ${k}（${skinLevelDesc[k] || '?'}）${lvDist[k]} 款`).join('，'));
L.push('- **皮肤图片**：每款皮肤均以官方皮肤 UUID 通过 `media.valorant-api.com/weaponskins/{uuid}/displayicon.png`（或 chromas 接口）解析出真实图片，见各枪械文件皮肤表。');
L.push('');

// 总览表
L.push('## 武器总览');
L.push('');
L.push('| 编号 | 武器 | 英文名 | 类型 | 价格 | 弹匣容量 | 穿透等级 | 开火模式 |');
L.push('| :---: | :--- | :--- | :--- | :--- | :---: | :--- | :--- |');
for (const g of guns) {
  L.push(`| ${g.id} | [${g.name}](guns/${gunFileName(g)}) | ${g.e_name} | ${g.type_name || '-'} | ${g.price || '-'} | ${g.cli_size ?? '-'} | ${g.penetration_name || '-'} | ${g.main_firing_mode || '-'} |`);
}
L.push('');

// 按类型索引
L.push('## 武器索引');
L.push('');
L.push('> 点击武器名跳转至对应详情文件。');
L.push('');
for (const t of typeOrder) {
  const group = guns.filter(g => (g.type_name || '未知') === t);
  L.push(`### ${t}`);
  L.push('');
  for (const g of group) {
    L.push(`- **${g.id}.** [${g.name}（${g.e_name}）](guns/${gunFileName(g)})`);
  }
  L.push('');
}

// ---------- 写文件 ----------
mkdirSync('../docs/guns', { recursive: true });
let count = 0;
for (const g of guns) {
  writeFileSync(`../docs/guns/${gunFileName(g)}`, renderGun(g), 'utf8');
  count++;
}
writeFileSync('../docs/无畏契约武器数据汇总.md', L.join('\n'), 'utf8');
console.log(`武器主文档生成完成, 枪械文件数: ${count}`);
