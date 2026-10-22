<div align="center">

<img src="../../assets/glass-folders.gif" width="640" alt="Glass Folders">

<h1>玻璃文件夹 · Glass Folders</h1>

<p><i>当卡片可以收纳。<br>When cards can be put away.</i></p>

<p><a href="https://old.lat/glass-folders/"><b>在线演示 Live demo →</b></a></p>

<p><a href="#中文">中文</a> · <a href="#english">English</a></p>

</div>

---

## 中文

整屏就三只文件夹，不用往下滚。光标放上去，磨砂玻璃朝你倾一点；点开，卡片才立起来、扇开。

原作者说得好：拟物做得好不好，不在纹理，而在因果——**铰链在底部，玻璃才会倒；新纸掉进口袋，口袋会沉。** 这个复刻就是照着这些因果关系来写的。

### 交互

| 操作 | 效果 |
|---|---|
| 悬停 | 前面的玻璃以底边为轴朝你倾斜，随光标左右微转；里面的卡片探出头 |
| 点击文件夹 · 回车 | 打开：卡片立起、扇形展开；再点一次收起 |
| `+` 按钮 | 新建一张卡片，从上方掉进口袋，口袋下沉再回弹，数量 +1 |
| `ooo` 按钮 | 玻璃菜单：关闭文件夹 / 重命名（原地编辑）/ 分享 / 移到废纸篓 |
| 点击外部 · Esc | 全部收起 |

### 使用

```html
<link rel="stylesheet" href="glass-folders.css">
<div id="folders"></div>
<script src="glass-folders.js"></script>
```

```js
const ui = new GlassFolders(document.getElementById('folders'), {
  folders: [{
    title: 'Selected work',
    theme: 'frost',               // 'frost' | 'light' | 'dark'
    cover: 'url(cover.jpg) center/cover',   // 背板，任意 CSS background
    action: 'add',                // 'add' | 'menu' | null
    align: 'left',                // 标题位置：'left' | 'right'
    meta: null,                   // 默认显示 "N items"
    cards: [
      { title: 'Aurora', sub: '极光冥想', bg: 'url(aurora.jpg) center/cover' },
      { title: 'Price list.pdf', sub: 'PDF · 480 KB', doc: true }   // 文档样式卡片
    ]
  }],
  onChange: (event, index, folder) => {}  // open close add rename share trash restore
});

ui.open(0); ui.close(0); ui.toggle(0);
ui.add(0, { title: 'New', sub: 'Just now', doc: true });
ui.restore(1);   // 从废纸篓恢复
```

### 实现要点

- 背板和玻璃口袋的轮廓用 `clip-path: path()` 画出，描边用同一条路径的 SVG
- 玻璃是 `backdrop-filter: blur() saturate()`，所以能透出后面卡片的颜色
- 口袋 `transform-origin` 在底边，悬停 `rotateX(-11deg)`，打开 `-17deg`，弹簧曲线
- 演示里的封面和卡片图全部是 CSS 渐变和 SVG 噪声生成的，没有任何图片文件

---

## English

Three folders, one screen, no scrolling. Hover and the frosted glass leans toward you; click and the cards stand up and fan out.

As the original designers put it, good skeuomorphism isn't texture, it's cause and effect: **the hinge is at the bottom, so the glass tips; a new sheet drops into the pocket, so the pocket sinks.** This recreation is written around those causes.

### Interaction

| Input | Action |
|---|---|
| Hover | Front glass tips toward you on its bottom hinge and follows the cursor slightly; cards peek out |
| Click · Enter | Open: cards stand up and fan out. Click again to close |
| `+` | Adds a card that drops into the pocket; the pocket sinks and springs back |
| `ooo` | Glass menu: Close folder / Rename (inline) / Share / Move to Trash |
| Click outside · Esc | Close all |

### Usage

```js
const ui = new GlassFolders(element, {
  folders: [{ title, theme, cover, action, align, meta, cards: [{ title, sub, bg, doc }] }],
  onChange: (event, index, folder) => {}
});

ui.open(i); ui.close(i); ui.toggle(i); ui.add(i, card); ui.restore(i); ui.destroy();
```

`theme` is `frost`, `light` or `dark`. `cover` and card `bg` take any CSS background. Cards with `doc: true` render as paper documents.

### Notes

- Panel and pocket outlines are `clip-path: path()`, stroked with the same SVG path
- The glass is `backdrop-filter`, so the cards behind it tint it
- The pocket hinges on its bottom edge: `rotateX(-11deg)` on hover, `-17deg` open, spring easing
- All demo artwork is CSS gradients and SVG noise. No image files

---

<sub>交互创意 Interaction idea: VG Studio — 小红书「当卡片可以收纳」 · 复刻 Recreated by <a href="https://eeoo.dev">Oldlee</a> · MIT</sub>
