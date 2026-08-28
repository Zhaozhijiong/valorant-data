# 结构化数据 JSON 说明（数据库导入）

本目录下的 JSON 文件由 `scripts/generate_db_json.mjs` 从原始抓取数据生成，字段已规范化（类型转换、布尔化、外键关联），可直接导入数据库（MySQL/PostgreSQL/SQLite/MongoDB 等）。

## 文件与数据量

| 文件 | 记录数 | 主键 | 说明 |
| --- | --- | --- | --- |
| `heroes.json` | 29 | `id` (Int) | 英雄 |
| `weapons.json` | 19 | `id` (Int) | 枪械 |
| `skins.json` | 1235 | `guid` (String) | 枪械皮肤（外键 `gun_id` → weapons） |
| `terms.json` | 92 | `id` (Int) | 术语（含地图点位） |
| `versions.json` | 72 | `id` (Int) | 版本更新（64 条含完整公告正文） |

## 表结构与字段

### heroes（英雄）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | Int | 主键，官方 API 编号（上线顺序） |
| `name` | String | 中文名 |
| `name_en` | String | 英文名 |
| `role` | String | 角色定位：先锋 / 决斗 / 控场 / 哨卫 |
| `role_position` | String | 位置：信息位 / 突击位 / 烟位 / 防守位 |
| `nationality` | String | 国籍 |
| `icon` | String | 头像 URL |
| `keywords` | String[] | 关键词列表（来自官方新手站） |
| `description` | String | 英雄描述（官方） |
| `intro` | String | 新手简介（官方新手站） |
| `intro_video` | String | 新手站介绍视频 URL |
| `skills` | Object[] | 技能数组，见下 |

`skills[]` 子结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `keypad` | String | 键位：C / Q / E / X |
| `name` | String | 技能中文名 |
| `name_en` | String | 技能英文名（部分为空） |
| `type` | String | 类型：基础技能 / 招牌技能 / 终极技能 |
| `type_id` | Int | 类型数值 |
| `cost_text` | String | 价格原文（含"免费""8点大招点数"） |
| `cost` | Int/null | 价格数值（免费=0，非数字为 null） |
| `description` | String | 技能描述 |
| `icon` | String | 技能图标 URL |
| `video_id` | String | 演示视频 ID（腾讯视频 vid） |

### weapons（枪械）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | Int | 主键，官方 API 编号 |
| `name` | String | 中文名 |
| `name_en` | String | 英文名 |
| `type` | String | 枪械类型：佩枪 / 冲锋枪 / 霰弹枪 / 步枪 / 狙击枪 / 机枪 |
| `price_text` | String | 价格原文 |
| `price` | Int | 价格数值（"免费"=0） |
| `magazine` | Int | 弹匣容量 |
| `penetration` | String | 穿透等级：低 / 中 / 高 |
| `fire_mode` | String | 开火模式：全自动 / 半自动 |
| `stats` | Object | 属性（数值型）：`firing_speed` 射速、`equipping_speed` 换枪速度、`loading_speed` 换弹速度、`moving_speed` 移动速度、`trajectory_deflection` 弹道偏移、`sup_trajectory_deflection` 开镜弹道偏移 |
| `damage` | Object[] | 伤害（按距离分段）：`distance` 距离、`head` 头部、`body` 身体、`leg` 腿部 |
| `description` | String | 武器描述 |
| `icon` | String | 图标 URL |

### skins（皮肤）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `guid` | String | 主键，Riot 皮肤 UUID |
| `gun_id` | Int | 外键 → weapons.id |
| `name` | String | 中文皮肤名 |
| `name_en` | String | 英文皮肤名 |
| `level` | Int | 品质等级 0–4 |
| `level_name` | String | 品质名：标准 / 精选 / 豪华 / 终极 / 至尊 |
| `limited` | Boolean | 是否限定（VCT 战队系列等） |
| `icon_uuid` | String | 图标 UUID（chroma 变体皮肤用于解析图片） |
| `primary_asset` | String | UE 游戏资源路径 |
| `image_url` | String/null | 可展示图片 URL（media.valorant-api.com；约 97% 可解析） |

### terms（术语）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | Int | 主键，官方 data-term-id |
| `category` | String | 分类：战术术语 / 交流术语 / 操作术语 / 地图通用术语 / 具体地图名 |
| `name` | String | 术语名 |
| `description` | String/null | 解释（地图点位术语多为 null，以插图示意） |
| `images` | String[] | 官方插图 URL（部分为占位图 temp_img.png） |
| `video_id` | String/null | 演示视频占位 ID |

### versions（版本更新）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | Int | 主键，时间线节点 ID |
| `date` | String | 更新日期 `YYYY-MM-DD` |
| `year` | Int | 年份 |
| `title` | String | 版本名 / 标题 |
| `is_major` | Boolean | 是否大版本（赛季更新等） |
| `highlights` | String[] | 更新要点（时间线摘要，1–3 条） |
| `docid` | String/null | 新闻 docid |
| `link` | String | 官方链接 |
| `news` | Object/null | 完整更新公告：`title` 标题、`publish_time` 发布时间、`content` 纯文本正文、`content_html` 原始 HTML |

## 表关系

```
weapons 1 ──── * skins        (skins.gun_id → weapons.id)
versions 1 ──── 0..1 news     (versions.news 内嵌对象)
heroes  1 ──── * skills       (heroes.skills 内嵌数组)
```

## 导入建议

- **关系型数据库**（MySQL/PostgreSQL）：将 `skills`、`damage`、`stats`、`keywords`、`highlights`、`news` 等嵌套结构拆为子表或使用 JSON 类型字段（MySQL 5.7+/PG 均支持 JSONB）。
- **文档型数据库**（MongoDB）：可直接整表导入，嵌套结构天然契合。
- 导入前建议建立唯一索引：`heroes.id`、`weapons.id`、`skins.guid`、`terms.id`、`versions.id`；`skins.gun_id` 建立普通索引。

## 重新生成

```bash
node generate_db_json.mjs   # 在 scripts/ 目录下执行，重新生成全部 JSON
```

> 生成依赖 `data/` 下的原始抓取数据（api_*.json、page2_newuser_*.html、timeline_entries.json、news_details.json 等）。
