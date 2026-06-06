# PosterForge Skill

[English](README.md)

[![CI](https://github.com/sumingcheng/posterforge-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/sumingcheng/posterforge-skill/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/v/tag/sumingcheng/posterforge-skill?label=version)](https://github.com/sumingcheng/posterforge-skill/tags)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933.svg)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-10.12.1-f69220.svg)](package.json)

用命令行参数或一份很小的 JSON，为 Agent、机器人、告警、战报、汇报和社交内容生成高质量移动端文字海报。

PosterForge Skill 不是设计软件，不是图片生成模型，不是 PPT 工具，也不是多图轮播系统。它是一个面向 Agent 的文字海报渲染器：支持直接命令行输入，版式稳定，本地渲染，输出高分辨率 PNG。

| Ledger | Arena | Signal |
| --- | --- | --- |
| ![Ledger 预览](docs/previews/ledger.png) | ![Arena 预览](docs/previews/arena.png) | ![Signal 预览](docs/previews/signal.png) |

## 30 秒开始

```bash
npm install -g posterforge
```

最快的方式不需要先写 JSON，直接通过命令行传入内容：

```bash
posterforge render \
  --style signal \
  --title "Service Health" \
  --summary "Errors dropped after the routing fix. Latency is back within the normal range." \
  --item "Impact: Only one provider route was affected." \
  --item "Action: Keep the fallback route enabled and monitor for one hour." \
  --item "Status: Traffic is stable and no new alerts are firing." \
  --out card.png
```

默认逻辑画布是 `1080x1440`，导出为 `3x`，最终 PNG 尺寸是 `3240x4320`。

如果需要稳定复用，再创建 `card.json`：

```json
{
  "style": "signal",
  "title": "Service Health",
  "summary": "Errors dropped after the routing fix. Latency is back within the normal range.",
  "content": [
    { "title": "Impact", "text": "Only one provider route was affected." },
    { "title": "Action", "text": "Keep the fallback route enabled and monitor for one hour." },
    { "title": "Status", "text": "Traffic is stable and no new alerts are firing." }
  ],
  "footer": "Ops Brief"
}
```

渲染：

```bash
posterforge render card.json --out card.png
```

也可以先用参数生成一份可复用 JSON：

```bash
posterforge spec \
  --style ledger \
  --title "Alert Brief" \
  --summary "Kong 4xx increased on one route." \
  --item "Cause: Upstream returned model-not-found." \
  --out card.json
```

## 为什么用 PosterForge

| 需求 | PosterForge 的做法 |
| --- | --- |
| Agent 需要稳定输出 | 使用很小的 `CardSpec`，不依赖自由 HTML 或图片提示词。 |
| 文字海报必须可读 | 每个主题都有保守的字数预算。 |
| 自动化流程需要可重复 | 依赖安装完成后，本地渲染结果稳定。 |
| 团队需要多种风格 | 内置 20 套视觉系统，用短 style 名选择。 |
| 开源贡献要简单 | 新主题集中在模板注册表和模板包里维护。 |

## 使用场景

| 场景 | 示例 | 推荐风格 |
| --- | --- | --- |
| 告警根因总结 | [examples/alert.json](examples/alert.json), [examples/incident-brief.json](examples/incident-brief.json) | `ledger`, `audit`, `terminal`, `noir` |
| 排行榜、战报 | [examples/battle-ranking.json](examples/battle-ranking.json) | `arena`, `podium`, `sprint`, `matrix` |
| 实验或 KPI 更新 | [examples/experiment.json](examples/experiment.json) | `signal`, `prism`, `atlas`, `mercury` |
| 周报、日报、团队简报 | [examples/weekly-brief.json](examples/weekly-brief.json) | `editorial`, `signal`, `atlas` |
| 产品发布更新 | [examples/product-update.json](examples/product-update.json) | `signal`, `bulletin`, `compass` |

渲染内置示例：

```bash
pnpm render:alert
pnpm render:incident
pnpm render:weekly
pnpm render:product
```

## 主题图廊

下面这些预览图都来自同一份 JSON 结构，可以用 `pnpm generate:previews` 重新生成。

| Arena | Podium | Sprint |
| --- | --- | --- |
| ![Arena 预览](docs/previews/arena.png) | ![Podium 预览](docs/previews/podium.png) | ![Sprint 预览](docs/previews/sprint.png) |

| Delta | Matrix | Heat |
| --- | --- | --- |
| ![Delta 预览](docs/previews/delta.png) | ![Matrix 预览](docs/previews/matrix.png) | ![Heat 预览](docs/previews/heat.png) |

| Ledger | Dossier | Audit |
| --- | --- | --- |
| ![Ledger 预览](docs/previews/ledger.png) | ![Dossier 预览](docs/previews/dossier.png) | ![Audit 预览](docs/previews/audit.png) |

| Terminal | Bulletin | Noir |
| --- | --- | --- |
| ![Terminal 预览](docs/previews/terminal.png) | ![Bulletin 预览](docs/previews/bulletin.png) | ![Noir 预览](docs/previews/noir.png) |

| Graphite | Signal | Pulse |
| --- | --- | --- |
| ![Graphite 预览](docs/previews/graphite.png) | ![Signal 预览](docs/previews/signal.png) | ![Pulse 预览](docs/previews/pulse.png) |

| Atlas | Prism | Compass |
| --- | --- | --- |
| ![Atlas 预览](docs/previews/atlas.png) | ![Prism 预览](docs/previews/prism.png) | ![Compass 预览](docs/previews/compass.png) |

| Mercury | Editorial |
| --- | --- |
| ![Mercury 预览](docs/previews/mercury.png) | ![Editorial 预览](docs/previews/editorial.png) |

## 安装

环境要求：

- Node.js `>=20`
- 开发时推荐使用 `pnpm`
- 高质量 PNG 导出需要 Chromium、Google Chrome 或兼容的无头浏览器

直接从 GitHub 安装：

```bash
npm install -g github:sumingcheng/posterforge-skill
```

从 npm 安装：

```bash
npm install -g posterforge
```

直接从源码使用：

```bash
git clone https://github.com/sumingcheng/posterforge-skill.git
cd posterforge-skill
pnpm install
pnpm build
node ./bin/posterforge.mjs render ./examples/alert.json --out ./dist/alert.png
```

开发时也可以把本地 CLI 挂到全局：

```bash
npm install -g .
posterforge templates
```

## CLI

从 JSON 渲染：

```bash
posterforge render card.json --out card.png
```

直接传参数渲染：

```bash
posterforge render --style mercury --title "Launch Notes" --summary "The release is ready." --item "Scope: Mobile onboarding." --item "Next: Watch activation." --out launch.png
```

创建 starter spec：

```bash
posterforge init --style signal --out card.json
```

列出所有风格：

```bash
posterforge templates
```

## Agent 和 Skill 使用

项目内置了 Skill 定义：[skill/SKILL.md](skill/SKILL.md)。可以给 OpenClaw、Codex、Claude 或任何支持读取 skill 文件并调用本地命令的 Agent runtime 使用。

推荐流程：

1. 把原始内容压缩成 `CardSpec`。
2. 根据意图选择风格。
3. 检查 [docs/TEXT_BUDGETS.md](docs/TEXT_BUDGETS.md)。
4. 渲染 PNG。
5. 检查图片是否截断或拥挤，再交付。

Agent 不应该在输出里说“我正在使用这个 skill”，直接生成图片即可。

完整 Agent 接入说明见 [docs/AGENT_USAGE.md](docs/AGENT_USAGE.md)。

## CardSpec

推荐输入非常简单：

```ts
type CardSpec = {
  style: string;
  title: string;
  summary: string;
  content: Array<{ title: string; text: string }> | string[] | string;
  footer?: string;
};
```

新的输入尽量只使用 `title`、`summary`、`content`。旧的 `metrics`、`rankings`、`sections` 仍然兼容，会被自动归一化成 `content`。

完整协议见 [docs/CARD_SPEC.md](docs/CARD_SPEC.md)。

## 风格

通过 `style` 选择视觉系统：

| 分类 | 风格 | 适合场景 |
| --- | --- | --- |
| 排行/战报 | `arena`, `podium`, `sprint`, `delta`, `matrix`, `heat` | 战报、排行榜、Top List |
| 运维/事故 | `ledger`, `dossier`, `audit`, `terminal`, `bulletin`, `noir`, `graphite` | 告警、事故、根因分析、排查总结 |
| 汇报/简报 | `signal`, `pulse`, `atlas`, `prism`, `compass`, `mercury`, `editorial` | KPI、实验、周报、日报、方向性总结 |

查看所有可用模板：

```bash
posterforge templates
```

## 字数预算

每个风格都有保守的字数预算。因为这些模板是固定海报版式，文字太长会破坏设计，甚至发生截断。

每个主题的限制见 [docs/TEXT_BUDGETS.md](docs/TEXT_BUDGETS.md)。

简单规则：

- 标题要短，不要写成长句。
- 摘要是一段结论，不要写成正文。
- 每个内容点都要短。
- 原始日志、长聊天记录、长文档必须先压缩。
- 如果渲染后看起来拥挤或被截断，必须缩短后重新渲染。

## 架构

```text
CardSpec JSON
  -> schema normalization
  -> template registry
  -> React/HTM templates
  -> Tailwind CSS
  -> high-DPI Chromium PNG
```

关键文件：

- [src/schema/card-spec.mjs](src/schema/card-spec.mjs)：输入归一化
- [src/templates/style-pack.mjs](src/templates/style-pack.mjs)：模板实现
- [src/templates/registry.mjs](src/templates/registry.mjs)：风格注册
- [bin/posterforge.mjs](bin/posterforge.mjs)：CLI 渲染器
- [docs/DESIGN_RESEARCH.md](docs/DESIGN_RESEARCH.md)：设计参考

## 开发

```bash
pnpm install
pnpm build
pnpm lint
pnpm check
pnpm dev
pnpm generate:previews
```

新增主题前先看 [CONTRIBUTING.md](CONTRIBUTING.md)。

npm 发布流程见 [docs/PUBLISHING.md](docs/PUBLISHING.md)。

## 设计原则

- 默认只生成一张图。
- 文字优先。
- 用字体和版式表达，而不是堆装饰。
- 输入 JSON 要小。
- 不伪造数据。
- 不直接塞长日志、长 transcript。
- 遵守每个主题的字数预算。
- 默认高分辨率导出。

## License

MIT。见 [LICENSE](LICENSE)。
