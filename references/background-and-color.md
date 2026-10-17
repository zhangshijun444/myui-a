# MyUi-A 背景与配色配方

## 原站实测基准

来源：`https://api.7maoo.com/`，2026-10-18。颜色来自页面 CSS 变量、已发布样式及实际 DOM 的 computed style（计算样式），不是从截图取近似色。浏览器可将十六进制转换为 Lab 表达，以下十六进制为原站 CSS 中的等价回退值。

| 语义 | 浅色 | 深色 |
|---|---|---|
| 页面底色 | `#ffffff` | **`#1e1e1e`** |
| 主文字 | `#0a0a0a` | `#f3f3f3` |
| 卡片变量 | `#ffffff` | `#2a2a2a` |
| 弹层 | `#ffffff` | `#2f2f2f` |
| 次级表面 muted | `#f5f5f5` | `#2f2f2f` |
| 次级表面 secondary | `#eeeeee` | `#373737` |
| 次级文字 | `#606060` | `#b7b7b7` |
| 主按钮／primary | `#3ea4ec` | `#0e72bc` |
| 细描边／border | `#e8e8e8` | `#ffffff1a`（白色约 10.2%） |
| 输入边界／input | `#e8e8e8` | `#ffffff2b`（白色约 16.9%） |
| 键盘焦点／ring | `#42a6ff` | `#1a75c5` |
| 代码面板 | 白色 95% | **`#0b0f17`，95%** |

注意：功能拼接卡的默认表面是页面 `background`，不是通用 `card` 变量。其 hover（悬停）是 muted 的 20% 叠层，不能把所有功能卡永久画成亮灰。

## 背景的五层关系

从底到顶：炭灰页面 → 首屏局部径向光晕 → 遮罩细网格 → 正文与控件 → 悬浮导航及弹层。图层留在对应 section（区块）内，不要把首屏背景 fixed（固定）到全页。

首屏父级采用 `position:relative; isolation:isolate; overflow:hidden`，光晕和网格绝对定位、禁止指针事件；正文放在高一层。这样可避免负 z-index（层叠顺序）落到整个文档背景后面。

### 首屏三层光晕：原始参数

```css
.hero-glow {
  background:
    radial-gradient(ellipse 60% 50% at 20% 20%,
      oklch(0.72 0.18 250 / 80%) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 80% 15%,
      oklch(0.65 0.15 200 / 60%) 0%, transparent 70%),
    radial-gradient(ellipse 40% 35% at 40% 80%,
      oklch(0.70 0.12 280 / 40%) 0%, transparent 70%);
  opacity: 0.25;
}
[data-theme="dark"] .hero-glow { opacity: 0.12; }
```

第一层是左上柔蓝，第二层是右上蓝青，第三层是左下淡紫。暗色各自峰值 alpha 在与同层其他渐变混合前分别约为 **9.6%、7.2%、4.8%**，不是 80%、60%、40%。光晕的柔软来自椭圆渐变，参考站这一层没有额外 blur（模糊）滤镜。

### 细网格与遮罩：原始参数

```css
.hero-grid {
  background-image:
    linear-gradient(to right, var(--border) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border) 1px, transparent 1px);
  background-size: 64px 64px;
  opacity: 0.08;
  -webkit-mask-image: radial-gradient(
    ellipse 60% 50% at 50% 30%, black 20%, transparent 100%);
  mask-image: radial-gradient(
    ellipse 60% 50% at 50% 30%, black 20%, transparent 100%);
}
```

深色 `border` 自带约 10% alpha，再乘 8% 图层 opacity，无遮罩衰减前线条最大有效 alpha 仅约 **0.8%**。正常截图几乎看不出完整格子是符合参考的；不要为让它“清晰可见”改成高对比亮线。遮罩令中心上方略可见、外缘与下方消失。

## 结尾行动区光晕

```css
.cta-glow {
  background:
    radial-gradient(ellipse 50% 50% at 30% 50%,
      oklch(0.70 0.15 250 / 70%) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 70% 40%,
      oklch(0.65 0.12 200 / 50%) 0%, transparent 70%);
  opacity: 0.20;
}
[data-theme="dark"] .cta-glow { opacity: 0.08; }
```

中间功能、流程区保持干净炭灰或白底。结尾光晕弱于首屏；不重复首屏网格。

## 代码面板与悬浮层

- 深色演示：`rgb(11 15 23 / 95%)`，边框白色 6%；内部线条白色 4–5%；响应区加白色 1.5%，底部指标栏加白色 2%。这使演示面板比页面更冷、更深，内部又能分层。
- 面板暗色阴影：`0 20px 60px -25px rgb(0 0 0 / 70%)`；浅色阴影：`0 20px 50px -25px rgb(15 23 42 / 18%)`。
- 滚动后的导航：页面底色 60%，`backdrop-filter:blur(40px)`，0.5px 环形描边，暗色阴影 `0 2px 16px -6px rgb(0 0 0 / 40%)`。
- 悬浮公告使用 `popover` 实色，正文需要稳定可读；不要把内容层与背景层一起降低透明度。

## 标题与协议强调色

标题渐变仅作用于文字：`linear-gradient(90deg,#51a2ff,#a684ff,#ad46ff)`，对应原站 blue-400 → violet-400 → purple-500；`background-clip:text; color:transparent`。

| 协议 | 浅色激活文字 | 深色激活文字 | 同步应用 |
|---|---|---|---|
| Chat | emerald-600 | emerald-400 | 标签、下划线、POST 徽标、响应强调 |
| Responses | amber-600 | amber-400 | 同上 |
| Claude | blue-600 | blue-400 | 同上 |
| Gemini | violet-600 | violet-400 | 同上 |

语法层次：命令为绿，命令参数为蓝，JSON 键为天蓝，字符串为浅琥珀，数字为浅紫，标点为弱灰。大面积背景不随协议切换。

## 拿来使用

`assets/myui-a.css` 已把配方落到 `.myui-a` 作用域。页面根节点设置 `class="myui-a" data-theme="dark"`；局部用 `.mua-hero`／`.mua-cta`，内含 `.mua-glow`／`.mua-grid` 装饰层。`starter.html` 展示了准确的层叠结构。

保持主题变量单一来源。迁移到别的产品时先替换内容，再调整强调色；用户要求原站深色底纹时保留本页的底色、透明度、尺寸与遮罩参数。
