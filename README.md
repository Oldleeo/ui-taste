<div align="center">

<img src="assets/banner.svg" alt="ui-taste" width="100%">

<h1>ui-taste · 老李的 UI 审美收藏</h1>

<p><b>把见过的好交互，一个个认真复刻出来。</b><br>
原生 JavaScript · 零依赖 · 复制即用</p>

<p>
<a href="https://old.lat/ui-taste/"><img src="https://img.shields.io/badge/在线演示-old.lat%2Fui--taste-111?style=flat-square" alt="在线演示"></a>
<img src="https://img.shields.io/badge/components-1-FF6A3D?style=flat-square" alt="components">
<img src="https://img.shields.io/badge/deps-0-111?style=flat-square" alt="zero deps">
<img src="https://img.shields.io/badge/license-MIT-111?style=flat-square" alt="MIT">
</p>

<p><b>简体中文</b> · <a href="README.en.md">English</a></p>

</div>

<br>

## 为什么做这个

好的界面往往赢在一些说不清的细节：一次回弹的力度、一声恰到好处的“咔哒”、边缘那一点点渐隐。
这里收录的每个组件，都来自我在设计圈看到、并且忍不住想亲手做一遍的交互。

不是“大概像”，而是**逐帧对照参考视频**，把尺寸、间距、节奏、声音都抠到位；再整理成干净、可复用的组件，谁都可以直接拿去用。

<br>

## 组件

<table>
<tr>
<td width="46%" valign="top">
<a href="components/wheel-dropdown"><img src="assets/wheel-dropdown.gif" alt="Wheel Dropdown"></a>
</td>
<td valign="top">

### 滚轮下拉 · Wheel Dropdown

> 下拉菜单，不一定要往下拉。

点开后，菜单原地展开成一个轮盘：选项沿弧线排列、向边缘渐隐模糊，刻度随滚动转动，每划过一格都有一声轻轻的“咔哒”。

- 滚轮、拖拽、键盘 ↑ ↓ 都能操作
- 回车 / 点击确认，Esc 取消
- 内置 Web Audio 点击声，可关闭
- 亮色 / 暗色主题

[**在线演示 →**](https://old.lat/wheel-dropdown/) &nbsp;·&nbsp; [源码与文档](components/wheel-dropdown)

<sub>灵感：<a href="https://ohwow.design">@omer_assa</a> · “Dropdowns don't have to drop down.”</sub>

</td>
</tr>
</table>

<p align="center"><sub>更多组件持续收录中 · 每一个都会附上原作者署名</sub></p>

<br>

## 快速上手

每个组件都在 `components/<名称>/` 下，只有一个 `.js` 和一个 `.css`，无需构建。

```html
<link rel="stylesheet" href="wheel-dropdown.css">

<div id="country"></div>

<script src="wheel-dropdown.js"></script>
<script>
  new WheelDropdown(document.getElementById('country'), {
    items: [
      { value: 'jp', label: 'Japan',  icon: '<svg>…</svg>' },
      { value: 'fr', label: 'France', icon: '<svg>…</svg>' }
    ],
    value: 'jp',
    onChange: item => console.log(item.value)
  });
</script>
```

<br>

## 收录原则

| | |
|---|---|
| **贴近原作** | 对照参考逐帧还原尺寸、间距、时间曲线和声音，而不只是“意思到了”。 |
| **零依赖** | 原生 JS + CSS，不绑框架，复制两个文件就能用。 |
| **可访问** | 在交互允许的范围内支持键盘操作与读屏。 |
| **双主题** | 默认适配亮色与暗色。 |
| **尊重原创** | 每个作品都注明原设计者与出处。 |

<br>

## 目录结构

```
ui-taste/
├── index.html                 # 组件画廊（在线演示首页）
├── assets/                    # 预览 GIF / MP4 / 横幅
└── components/
    └── wheel-dropdown/
        ├── wheel-dropdown.js
        ├── wheel-dropdown.css
        ├── flags.js           # 演示用国旗 SVG
        ├── index.html         # 独立演示页
        └── README.md
```

<br>

## 致谢与许可

交互创意归原设计者所有，均在各组件中注明。代码由 [老李 Oldlee](https://eeoo.dev) 编写，以 [MIT](LICENSE) 协议开源。

如果你也看到了某个让人眼前一亮的交互，欢迎开 [Issue](https://github.com/Oldleeo/ui-taste/issues) 推荐给我。

<div align="center"><br><sub>Made with taste in Kuala Lumpur.</sub></div>
