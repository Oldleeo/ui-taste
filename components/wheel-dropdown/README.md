# Wheel Dropdown · 滚轮下拉

<img src="../../assets/wheel-dropdown.gif" width="480">

A dropdown that doesn't drop down. Click and it opens in place as a wheel centred on the current value: items curve along an arc, fade and blur toward the edges, tick marks move with the scroll, and each step makes a soft click.

[Live demo](https://old.lat/ui-taste/components/wheel-dropdown/index.html)

## Interaction

| Input | Action |
|---|---|
| Click / Enter / ↑ ↓ | Open |
| Scroll · drag · ↑ ↓ | Move |
| Click an item · Enter · click outside | Select and close |
| Esc | Close without changing |

## API

```js
const dd = new WheelDropdown(element, {
  items: [{ value, label, icon }], // icon: optional HTML (SVG or <img>)
  value: 'Japan',                   // initial value
  sound: true,                      // click sound via Web Audio, no files
  volume: 1,
  onChange: item => {}
});

dd.value;          // current value
dd.value = 'France';
dd.setSound(false);
```

Theme: set `data-theme="light" | "dark" | "auto"` on the element. Colours are CSS variables (`--wdd-card`, `--wdd-ink`, `--wdd-mute`, `--wdd-hl`).

## Credit

Interaction idea by [@omer_assa](https://ohwow.design) ("Dropdowns don't have to drop down"). Recreated by Oldlee. MIT.
