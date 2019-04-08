# comparison-slider

Comparing two images. No dependencies.

[![Latest NPM release](https://img.shields.io/npm/v/comparison-slider.svg)](https://www.npmjs.com/package/comparison-slider)
![MIT License](https://img.shields.io/npm/l/comparison-slider.svg)

## Example

- [basic](https://yomotsu.github.io/comparison-slider/examples/basic.html)
- [auto attach (easiest!)](https://yomotsu.github.io/comparison-slider/examples/auto-attach.html)
- [responsive](https://yomotsu.github.io/comparison-slider/examples/responsive.html)
- [responsive-keep-aspect](https://yomotsu.github.io/comparison-slider/examples/responsive-keep-aspect.html)
- [custom](https://yomotsu.github.io/comparison-slider/examples/custom.html)
- [auto](https://yomotsu.github.io/comparison-slider/examples/auto.html)

## Usage



```html
<div class="ComparisonSlider">
  <div
    class="ComparisonSlider__Before"
    style="background-image: url(./img-a.jpg)"
  ></div>
  <div
    class="ComparisonSlider__After"
    style="background-image: url(./img-b.jpg)"
  ></div>
</div>
```

Declare the height of the view.

```css
.ComparisonSlider {
  width: 600px;
  height: 400px;
}
```

then...

### As a module

```js
import ComparisonSlider from 'comparison-slider';
const comparisonSlider = new ComparisonSlider();
```

### in browser

```html
<script src="path/to/comparison-slider.min.js"></script>
<script>
const comparisonSlider = new ComparisonSlider();
</script>
```
