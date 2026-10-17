# MyUi-A

一套可直接用于 Codex 的网页设计技能（Skill），以及无需构建的 HTML / CSS / JavaScript 首页示例。

以炭灰底色、克制的蓝青紫光晕、极淡遮罩网格、渐变标题与悬浮导航，构建清晰、精致的科技产品界面。支持深浅主题、手机布局、键盘操作与减少动态效果。

**开源许可证：[MIT](LICENSE)**。可以使用、修改、分发和商用；分发时保留许可证及版权声明。

## 包含什么

- **设计规范**：首屏、导航、演示面板、拼接功能卡、流程与页脚的比例、状态和动效。
- **背景配方**：炭灰 `#1e1e1e`、三层径向光晕、64px 网格、椭圆遮罩和明暗主题变量。
- **完整示例**：协议标签切换、中英切换、主题菜单、通知、手机导航及本地文档弹层。
- **技能入口**：`SKILL.md` 与 `agents/openai.yaml`，可随现有项目使用；不要求更换框架。

示例使用原生网页技术，无构建步骤、第三方运行时依赖或远程字体。协议请求、响应与指标均为本地演示数据。

## 安装到 Codex

在已安装 Git 的 PowerShell 中执行：

```powershell
$skillRoot = if ($env:CODEX_HOME) {
    Join-Path $env:CODEX_HOME "skills"
} else {
    Join-Path $env:USERPROFILE ".codex\skills"
}
New-Item -ItemType Directory -Force -Path $skillRoot | Out-Null
git clone https://github.com/zhangshijun444/myui-a.git (Join-Path $skillRoot "myui-a")
```

也可以通过 GitHub 的 **Code → Download ZIP** 下载，解压后把仓库文件夹命名为 `myui-a`，放入同一技能目录。已有同名技能时先保留备份，再决定是否替换。

重新打开 Codex 或新建聊天，使技能被发现，然后输入：

```text
使用 $myui-a 为我的产品设计首页，保留深色底纹、蓝青光晕、
渐变标题、悬浮导航和交互面板，使用当前项目的技术栈。
```

## 预览示例

直接在浏览器打开 [assets/starter.html](assets/starter.html)，并保持同目录的 `myui-a.css` 和 `starter.js` 一起存在。也可以使用现有项目的静态开发服务器。

采用 React、Vue 或 Tailwind 时，可迁移设计变量与组件关系；示例中的品牌、文案、链接和业务行为应按实际产品改写。

## 文件导航

```text
myui-a/
├── SKILL.md
├── agents/openai.yaml
├── assets/
│   ├── myui-a.css
│   ├── starter.html
│   └── starter.js
├── references/
│   ├── design-system.md
│   ├── background-and-color.md
│   └── source-observations.md
├── LICENSE
└── NOTICE.md
```

- [技能使用说明](SKILL.md)
- [完整设计规范](references/design-system.md)
- [背景与配色配方](references/background-and-color.md)
- [参考来源及观察范围](references/source-observations.md)

## 参考来源与贡献

视觉研究参考了 [7maooAPI 的公开首页](https://api.7maoo.com/)，基准记录日期为 2026-10-18。仓库提供重新编写、去品牌化的实现和设计说明，与参考网站无隶属或背书关系。

第三方网站截图、商标、原站脚本、账户信息与公告未随仓库发布；详见 [NOTICE.md](NOTICE.md)。

欢迎通过 [Issues](https://github.com/zhangshijun444/myui-a/issues) 反馈问题，或提交 Pull Request（合并请求）。提交改动时请说明目的与验证方式；提交给本项目的贡献按同一 MIT 许可证提供。
