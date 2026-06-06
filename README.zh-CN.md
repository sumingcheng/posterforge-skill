# PosterForge Skill

[English](README.md)

用一份很小的 JSON，生成高质量的移动端文字海报图。

PosterForge Skill 是一个轻量的 React/Tailwind 海报渲染器，适合 Agent、机器人和自动化工作流。你只需要提供标题、摘要和几个内容点，它就会生成一张适合手机阅读的 `1080x1440` PNG。

适合用来做：

- 告警和事故总结图
- 排行榜、战报图
- 实验和 KPI 更新
- 周报、日报、简报
- 文字型社交媒体单图

它不是通用海报设计系统，也不负责生成图片素材、插画、多图轮播。它专注做一件事：快速生成一张好看的文字卡片。

## 预览

```json
{
  "style": "ledger",
  "title": "Lorem Ipsum",
  "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "content": [
    { "title": "Dolor Sit", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { "title": "Amet Elit", "text": "Praesent commodo cursus magna, vel scelerisque nisl consectetur et." }
  ],
  "footer": "PosterForge Skill"
}
```

```bash
posterforge render card.json --out card.png
```

默认逻辑画布是 `1080x1440`，导出为 `3x`，最终 PNG 尺寸是 `3240x4320`。

## 安装

环境要求：

- Node.js `>=20`
- 开发时推荐使用 `pnpm`
- 高质量 PNG 导出需要 Chromium、Google Chrome 或兼容的无头浏览器

现在可以直接从 GitHub 安装：

```bash
npm install -g github:sumingcheng/posterforge-skill
```

发布到 npm 后也可以这样安装：

```bash
pnpm add -g posterforge-skill
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

## 快速开始

创建 `card.json`：

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

常用命令：

```bash
posterforge templates
posterforge render card.json --out card.png --scale 2
posterforge html card.json --out card.html
```

如果你是从源码运行，把 `posterforge` 替换成 `node ./bin/posterforge.mjs`。

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

## Agent 使用

项目内置了 Skill 定义：[skill/SKILL.md](skill/SKILL.md)。

Agent 使用时应该：

1. 把原始内容压缩成 `CardSpec`。
2. 选择一个合适的 `style`。
3. 检查该风格的字数预算。
4. 渲染 PNG。
5. 检查图片是否截断或拥挤，再交付。

Agent 不应该在输出里说“我正在使用这个 skill”，直接生成图片即可。

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
pnpm check
pnpm dev
```

渲染示例：

```bash
pnpm render:alert
pnpm render:experiment
pnpm render:battle
```

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

MIT
