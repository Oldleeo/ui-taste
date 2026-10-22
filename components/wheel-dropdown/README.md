<div align="center">

<img src="../../assets/wheel-dropdown.gif" width="520" alt="Wheel Dropdown">

<h1>滚轮下拉 · Wheel Dropdown</h1>

<p><i>下拉菜单，不一定要往下拉。<br>Dropdowns don't have to drop down.</i></p>

<p><a href="https://old.lat/wheel-dropdown/"><b>在线演示 Live demo →</b></a></p>

<p><a href="#中文">中文</a> · <a href="#english">English</a></p>

</div>

---

## 中文

点开后，菜单在原地展开成一个以当前值为中心的轮盘：选项沿弧线排列，越往边缘越淡、越模糊；左侧刻度跟着滚动转动；每划过一格都有一声轻轻的“咔哒”，确认时再响一声更实的。

### 操作

| 输入 | 效果 |
|---|---|
| 点击 · 回车 · ↑ ↓ | 展开 |
| 滚轮 · 拖拽 · ↑ ↓ | 切换选项 |
| 点击选项 · 回车 · 点击外部 | 选中并收起 |
| Esc | 不改变，直接收起 |

### 使用

```html
<link rel="stylesheet" href="wheel-dropdown.css">
<div id="country" data-theme="auto"></div>
<script src="wheel-dropdown.js"></script>
```

```js
const dd = new WheelDropdown(document.getElementById('country'), {
  items: [{ value: 'jp', label: 'Japan', icon: '<svg>…</svg>' }], // icon 可选：SVG 或 <img>
  value: 'jp',        // 初始值
  sound: true,        // Web Audio 合成点击声，无需音频文件
  volume: 1,          // 音量 0–1
  onChange: item => {}
});

dd.value;             // 读取当前值
dd.value = 'fr';      // 设置
dd.setSound(false);   // 关闭声音
```

### 主题

在容器上设置 `data-theme="light" | "dark" | "auto"`。颜色都是 CSS 变量，可直接覆盖：

| 变量 | 含义 |
|---|---|
| `--wdd-card` | 卡片底色 |
| `--wdd-ink` | 主文字 |
| `--wdd-mute` | 次要文字 / 刻度 |
| `--wdd-hl` | 选中高亮 |

---

## English

Click it and the menu opens in place as a wheel centred on the current value. Items curve along an arc and fade and blur toward the edges, the ticks on the left turn with the scroll, and every step makes a soft click, with a firmer one on confirm.

### Interaction

| Input | Action |
|---|---|
| Click · Enter · ↑ ↓ | Open |
| Scroll · drag · ↑ ↓ | Move |
| Click an item · Enter · click outside | Select and close |
| Esc | Close without changing |

### Usage

```js
const dd = new WheelDropdown(element, {
  items: [{ value, label, icon }], // icon: optional HTML (SVG or <img>)
  value: 'jp',                      // initial value
  sound: true,                      // synthesized click via Web Audio, no files
  volume: 1,                        // 0–1
  onChange: item => {}
});

dd.value;          // current value
dd.value = 'fr';
dd.setSound(false);
```

### Theming

Set `data-theme="light" | "dark" | "auto"` on the element. Colours are CSS variables: `--wdd-card`, `--wdd-ink`, `--wdd-mute`, `--wdd-hl`.

---

<sub>交互创意 Interaction idea: <a href="https://ohwow.design">@omer_assa</a> — “Dropdowns don't have to drop down.” · 复刻 Recreated by <a href="https://eeoo.dev">Oldlee</a> · MIT</sub>
