#Popo

*A JavaScript library for positioning elements*

Popo is a cross-browser (Chrome, Opera, Firefox, Safari, IE7+) JavaScript library that attempts to simplify the process of positioning HTML elements relative to other HTML elements regardless of their whereabouts in the DOM tree. The library is heavily influenced by **[jQuery UI Position plugin](http://jqueryui.com/position/)**, but does not require jQuery or any other library to work. It's completely stand-alone.

##Download

* **[v0.9 - Production](https://raw.github.com/niklasramo/popo/dev/popo.min.js)** (4kb minified)
* **[v0.9 - Development](https://raw.github.com/niklasramo/popo/dev/popo.js)** (21kb uncompressed)

##Usage

```javascript
// The format
popo(element, method, options);
```

__element__ *(type: element, required)*  
Provide the target element that you want to position.

__method__ *(type: string, optional)*  
Provide a method (`set` or `get`). Defaults to `set`.

__options__ *(type: object, optional)*  
Provide an object containing options. You can change the default options by modifying `popo.defaults`.

## Methods

Name | Description
--- | ---
**set** | <p>Positions the target element by setting the target element's left and top CSS properties according to the position calculations.</p>
**get** | <p>Returns an object containing the calculated position of the target element. The returned object has two properties: <code>left</code> and <code>top</code>.</p>

## Options

Property | Default | Type | Description
--- | --- | --- | ---
**base** | window | *Element, Array* | <p>Defines which element the target element is positioned against. Alternatively you can define a coordinate using an array: [x-coordinate, y-coordinate, element].</p>
**position** | "center center center center" | *String* | <p>Defines the target element's position relative to the base element. The format is "targetX targetY baseX baseY". Use `left`, `right` and `center` to describe the horizontal position and `top`, `bottom` and `center` to describe the vertical position.</p>
**offset** | "0" | *String* | <p>Defines a horizontal and a vertical offset in pixels. The basic format is "offsetX offsetY", or alternatively just "offset" if you want to use the same value for both the vertical and the horizontal offset. You can also define multiple offsets that stack up by separating the offset values with a comma (e.g. "12,12 -21,31 40").</p><p>For a bit more advanced usage you can define an angular offset by providing the option with an angle in degrees and a distance in pixels (e.g. "120deg 300"). Note that the first value must have the trailing "deg" string for Popo to identify the offset as an angular offset. Also note that zero degrees points to east.</p>
**container** | null | *Element, Array* | <p>Defines an optional container element that is used for collision detection. Alternatively you can define a coordinate using an array: [x-coordinate, y-coordinate, element].</p>
**onCollision** | "none" | *String, Function* | <p>Defines what to do when the target element overflows the container element. The container element must be defined for this option to have any effect. You can either define a built-in collision method for each side with the format "left top right bottom" (e.g. "push none none push") or pass in a function and use this option as a callback function.</p><p>Popo has two built-in collision methods, <code>push</code> and <code>push!</code>, <code>none</code> will skip collision handling.</p><p><code>push</code> method tries to keep the targeted sides of the target element within the container element's boundaries. If you assign <code>push</code> method to the opposite sides the force of push will be equal on both sides. If you want to force one of the sides to be always pushed fully inside the container element's area, you can assign a forced push to that side with <code>push!</code> method.</p>

##Examples

__EX-1:__ Position target on top of base.

```javascript
popo(document.getElementById("target"), {
  position: "center bottom center top",
  base: document.getElementById("base")
});
```

__EX-2:__ Use `get` method to retrieve target's position without actually positioning the target.

```javascript
var position = popo(document.getElementById("target"), 'get', {
  position: "left top right center",
  base: document.getElementById("base")
});

// The get method returns an object containing the final left and top values
// position.left => returns the final left position of target element 
// position.top => returns the final top position of target element
```

##Prequisites

* Target element's CSS position property must be *absolute* or *fixed*.
* The CSS display property of target/base/container elements must not be *none*.
* You can use Popo to position elements within other windows (iframes) also, but you have to make sure that target/base/container elements exist within the same window.
* The target element's margin affects the final position calculated by Popo, so consider the margin as an extra offset. This is a feature not a bug.
* Popo uses the outer width/height (includes scrollbar, borders and padding) of the HTML element when calculating positions. However, in the case of window, document and documentElement the scrollbar width/height is omitted.

## License

Copyright (c) 2013 Niklas Rämö. Licensed under **[the MIT license](https://github.com/niklasramo/popo/blob/master/LICENSE.md)**.
