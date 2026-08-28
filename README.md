# 无畏契约（VALORANT）英雄 / 武器数据汇总

抓取腾讯官方《无畏契约》官网的英雄与武器数据，汇总为 Markdown 文档。

## 目录结构

```
Valorant/
├── scripts/                      # 数据提取与生成脚本（Node.js，需 >= v18）
│   ├── fetch_pages.mjs           # ① 抓取两个目标页面 HTML（经本机代理 127.0.0.1:7897）
│   ├── fetch_js.mjs              # ② 抓取页面依赖的 JS（game-data.js / common.js）
│   ├── fetch_api.mjs             # ③ 调用 GraphQL API：英雄列表 + 详情字段探测
│   ├── fetch_extra.mjs           # ④ 调用 GraphQL API：国籍、位置等扩展字段 + tabs 结构
│   ├── fetch_schema.mjs          # ⑤ GraphQL introspection：Agent 完整字段结构
│   ├── fetch_all_agents.mjs      # ⑥ 批量抓取全部英雄详情（技能/契约，6 并发）
│   ├── fetch_tabs.mjs            # ⑦ 探测 tabs 字段（结果不可用，仅留档）
│   ├── fetch_guns.mjs            # ⑧ 抓取枪械页 + 枪械列表 + Gun schema + 单枪详情
│   ├── refetch_guns_full.mjs     # ⑨ 一条查询获取全部枪械完整字段（伤害/属性/皮肤含 guid/limited）
│   ├── resolve_skin_images.mjs   # ⑩ 全量解析 1254 款皮肤图片 URL（media.valorant-api.com）
│   ├── generate_md.mjs           # ⑪ 合并数据源，生成英雄主文档 + heroes/ 拆分文件
│   ├── generate_guns_md.mjs      # ⑫ 生成武器主文档 + guns/ 拆分文件（含皮肤图片表）
│   ├── fetch_newuser_page2.mjs   # ⑬ 抓取新手站 page2.html（战术进阶-术语科普）
│   ├── generate_terms_md.mjs     # ⑭ 解析术语科普，生成术语文档
│   ├── fetch_all_news.mjs        # ⑮ 解析版本时间线 + 批量抓取 64 篇版本更新公告（CMC 接口）
│   └── generate_versions_md.mjs  # ⑯ 生成版本更新汇总主文档 + versions/ 按版本拆分
├── data/                         # 抓取的原始数据（留档，可重新抓取覆盖）
│   ├── page1_gamedata.html       #   游戏资料页-英雄（GBK 原始 + UTF-8 转换版）
│   ├── page1_gamedata_p2.html    #   游戏资料页-枪械（GBK 原始 + UTF-8 转换版）
│   ├── page2_newuser_utf8.html   #   官方新手站-英雄介绍（关键词/简介来源）
│   ├── page2_newuser_page2.html  #   官方新手站-战术进阶（GBK 原始 + UTF-8 转换版，术语来源）
│   ├── js_game_data.js(.utf8)    #   页面 JS（发现 window.allHeroData 与 API 调用）
│   ├── js_common.js(.utf8)       #   common.js（GraphQL API 端点定义处）
│   ├── VersionTimeline.js(.utf8) #   版本时间线数据文件（72 条版本节点）
│   ├── timeline_entries.json     #   解析后的时间线条目
│   ├── news_details.json         #   64 篇版本更新公告正文
│   └── api_*.json                #   GraphQL API 返回数据（英雄/枪械）
└── docs/
    ├── 无畏契约英雄数据汇总.md    # 英雄主文档：总览表 + 按角色索引（英雄名均链接至详情文件）
    ├── heroes/                    # 按英雄拆分：每位英雄一个独立文件（便于以英雄为单位扩展）
    │   ├── 01-铁臂-Breach.md      #   命名规则：两位编号-中文名-英文名.md
    │   ├── 02-捷风-Jett.md
    │   └── ...                    #   共 29 个
    ├── 无畏契约武器数据汇总.md    # 武器主文档：总览表 + 按类型索引（武器名均链接至详情文件）
    ├── guns/                      # 按枪械拆分：每把枪一个独立文件
    │   ├── 01-标配-Classic.md     #   命名规则：两位编号-中文名-英文名.md
    │   ├── 02-短炮-Shorty.md
    │   └── ...                    #   共 19 个
    └── 无畏契约术语汇总.md        # 术语文档：92 条术语（战术/交流/操作/地图通用 + 11 图点位）
    ├── 无畏契约版本更新汇总.md    # 版本更新主文档：16 个大版本速览 + 72 条完整时间线
    └── versions/                  # 按版本拆分：每版一个独立文件（含完整更新公告正文）
        ├── 20230712-无畏契约正式上线.md
        ├── 20260611-v12.11版本.md
        └── ...                    #   共 72 个
```

## 数据来源

| 来源 | 提供字段 |
| --- | --- |
| [游戏资料-英雄数据页](https://val.qq.com/game-data.html?pageType=1&&heroId=1)（GraphQL API `https://api.val.qq.com/go/agame/graphql/graphiQL`） | 英雄名称（中/英）、角色定位、位置、国籍、英雄描述、技能介绍（键位/名称/类型/价格/描述）、契约 |
| [官方新手站-英雄介绍](https://val.qq.com/act/a20250102NewUserGuide/page1_1.html) | 英雄关键词、新手简介、角色分组 |
| [游戏资料-枪械数据页](https://val.qq.com/game-data.html?pageType=2)（GraphQL API 同上） | 枪械名称（中/英）、类型、价格、弹匣容量、穿透等级、开火模式、属性（射速/换枪/换弹/移动/弹道偏移）、伤害（头/身/腿/距离）、武器描述、皮肤（名称/英文名/等级/限定标志/皮肤 UUID） |
| [media.valorant-api.com](https://media.valorant-api.com)（皮肤图片 CDN，按官方皮肤 UUID 解析） | 皮肤图片（`weaponskins/{guid}/displayicon.png`，chroma 变体走 `weaponskinchromas/{icon}/displayicon.png`）；1218/1254 款可解析 |
| [官方新手站-战术进阶-术语科普](https://val.qq.com/act/a20250102NewUserGuide/page2.html) | 92 条术语：战术/交流/操作/地图通用术语（含官方解释与演示视频/插图）+ 11 张地图的特殊点位术语（含插图） |
| [官方版本时间线](https://val.qq.com/act/a20250228timeline/)（`VersionTimeline.js`）+ 各版本更新公告（CMC 新闻接口） | 72 个版本节点（日期/版本名/类型/要点），64 篇完整更新公告正文 |

## 重新生成步骤

```bash
# 在 scripts/ 目录下依次执行（抓取步骤可跳过，直接用 data/ 已有数据）
node fetch_pages.mjs        # 抓取两个页面（需本机代理 127.0.0.1:7897 可用）
node fetch_js.mjs           # 抓取页面 JS
node fetch_api.mjs          # 英雄列表
node fetch_extra.mjs        # 扩展字段
node fetch_all_agents.mjs   # 全部英雄详情
node refetch_guns_full.mjs  # 全部枪械完整详情（含皮肤 guid/limited）
node resolve_skin_images.mjs # 解析全部皮肤图片 URL（生成 data/api_skin_images.json）
node generate_md.mjs        # 生成 docs/ 英雄主文档 + docs/heroes/ 下每位英雄的独立文件
node generate_guns_md.mjs   # 生成 docs/ 武器主文档 + docs/guns/ 下每把枪的独立文件
node fetch_newuser_page2.mjs # 抓取新手站 page2（术语来源，GBK 需转 UTF-8）
node generate_terms_md.mjs  # 生成 docs/ 无畏契约术语汇总.md
node fetch_all_news.mjs     # 解析时间线 + 抓取全部版本更新公告
node generate_versions_md.mjs # 生成 docs/ 版本更新汇总 + versions/ 拆分文件
```

> 说明：`data/` 下 `.utf8` 后缀文件为 GBK 原文件的 UTF-8 转换版；脚本解析时使用 UTF-8 版。

## 备注

- 英雄编号为官方 API 顺序（即上线顺序），编号 1–26 有新手站关键词/简介，27–29（幻棱、禁灭、迷核）发布于新手站之后，仅有 API 数据。
- 武器编号为官方 API 顺序，共 19 把（官方数据不含近战武器）；皮肤等级：0=标准、1=精选、2=豪华、3=终极、4=至尊；已过滤官方数据中的"从个人最爱中随机选择"占位条目。
- 皮肤数据：总计 1235 款（含限定 99 款）。每款含中文名/英文名/等级/限定标志/皮肤 UUID；其中 1218 款可解析出真实图片（其余 36 款为消音变体类皮肤——Riot 数据本身无图标，或国服新皮肤社区库尚未收录）。
- 沙箱环境 HTTPS 直连被拦截，抓取通过本机代理 `127.0.0.1:7897` + Node.js（OpenSSL TLS）完成。
