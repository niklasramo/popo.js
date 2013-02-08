#Popo JS

*A JavaScript library for positioning elements*

Popo JS is a stand-alone cross-browser JavaScript library that makes it easy to position elements relative to other elements in various ways. Popo JS is heavily influenced by **[jQuery UI Position plugin](http://jqueryui.com/position/)**.

The aim of Popo JS is to simplify the process of positioning DOM elements with JavaScript. The library is designed to work in all modern browsers (Chrome, Opera, Firefox, Safari, IE6+). However, it's a given there are still some currently unknown bugs between the lines so further testing is still needed to eradicate them.

**NOTE: Keep in mind that there might be some API changes before v1.0 release.**

##Get started

###Download

* **[v0.7.5 - Production](https://raw.github.com/niklasramo/popo/master/popo.min.js)** (5.7kb minified)
* **[v0.7.5 - Development](https://raw.github.com/niklasramo/popo/master/popo.js)** (18kb uncompressed)

Download Popo JS library and include it in your HTML Document, preferrably inside the head tag.

```html
<script src="popo.min.js"></script>
```

###Know the prequisites

* Target element's CSS position property must be *relative*, *absolute* or *fixed*.
* The CSS display property of target element, base element and container element must not be *none*.

###Start using

Popo has two methods: <code>get</code> and <code>set</code>. The <code>set</code> method positions the target element to the specified position by adjusting the element's left and top CSS properties. The <code>get</code> method calculates the specified position and returns the left and top CSS properties. Both methods require the target element as the first argument and additionally an options object as the second argument.

```javascript
// The format
window.popo[methodName]( targetElement, options );

// A real world example
// -> place target in the center of base 
window.popo.set( document.getElementById("target"), {
  position: "center",
  base: document.getElementById("base")
});
```

## Methods

Name | Description
--- | ---
**set** | <p>Positions the target element by setting the target element's left and top CSS properties according to the position calculations.</p>
**get** | <p>Returns an object containing the calculated position of the target element. The returned object has two properties: <code>left</code> and <code>top</code>.</p>

## Options

Property | Default | Type | Description
--- | --- | --- | ---
**position** | "center" | *String* | <p>Defines the target element's position relative to the base element. The format is "targetX targetY baseX baseY". A horizontal position can be `left`, `right` or `center` while a vertical position can be `top`, `bottom` or `center`.</p><p>Alternatively, you can use a single shortcut value: `nw`, `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `center`.</p>
**offset** | "0" | *String* | <p>Defines a horizontal and a vertical offset (in pixels). For basic usage provide the option with a string containing two numbers (e.g. "-12 90"). The format is "offsetX offsetY". One number will be used for both offsets (e.g. "10").</p><p>For a bit more advanced usage you can define an angular offset by providing the option with an angle in degrees and a distance in pixels (e.g. "120deg 300"). Note that the first value must have the trailing "deg" string for Popo to identify the offset as an angular offset. Also note that zero degrees points to east.</p><p>For even more advanced usage you can provide the option with multiple offsets by separating the different offsets with a comma (e.g. "12, 30deg -600, -56 98, 1000deg 9").</p>
**base** | window | *Element, Array* | <p>Defines which element the target element is positioned against. Alternatively you can define a coordinate with an array. The format is: [x-coordinate, y-coordinate, element]. The coordinates must be numbers (integers or floats) and the element must be a DOM element, the document object or the window object. The element is used to define the scope of the coordinates.</p>
**container** | null | *Element* | <p>Defines what to do when the target element overflows the container element. The container element must be defined for this option to have any effect. You can either define a built-in collision method for each side with the format "left top right bottom" (e.g. "push none none push") or pass in a function and use this option as a callback function. The format for using built-in collision methods is "left top right bottom".</p><p>Popo has two built-in collision methods, <code>push</code> and <code>push!</code>, <code>none</code> will skip collision handling.</p><p><code>push</code> method tries to keep the targeted sides of the target element within the container element's boundaries. If you assign <code>push</code> method to the opposite sides the force of push will be equal on both sides. If you want to force one of the sides to be always pushed fully inside the container element's area, you can assign a forced push to that side with <code>push!</code> method.</p>
**onCollision** | "push" | *String, Function* | <p>Defines what to do when the target element overflows the container element. The container element must be defined for this option to have any effect. You can either define a built-in collision method for each side with the format "left top right bottom" (e.g. "push none none push") or pass in a function and use this option as a callback function.</p><p>Popo has two built-in collision methods, <code>push</code> and <code>push!</code>, <code>none</code> will skip collision handling.</p><p><code>push</code> method tries to keep the targeted sides of the target element within the container element's boundaries. If you assign <code>push</code> method to the opposite sides the force of push will be equal on both sides. If you want to force one of the sides to be always pushed fully inside the container element's area, you can assign a forced push to that side with <code>push!</code> method.</p>
**setClass** | false | *Boolean* | <p>If true, a class name (constructed out of the library name and the position option) will be automatically added to the target element. The format is "libName-positionOption", all empty spaces are replaced with dashes. For example, if the position option value is "left top right center" the constructed class name would be "popo-left-top-right-center".</p>

##Examples

To make the examples a bit easier on the eyes, let's assume that you have at least three elements in your HTML document with ids *target*, *base* and *container*.

```javascript
var target = document.getElementById("target"),
    base = document.getElementById("base"),
    container = document.getElementById("container");
```

__EX-1:__ Use <code>set</code> method to position target on top of base.

```javascript
window.popo.set( target, {
  position: "n",
  base: base
});
```

__EX-2:__ Use <code>get</code> method to retrieve target's position without actually positioning the target.

```javascript
var position = window.popo.get( target, {
  position: "n",
  base: base
});

// The get method returns and object containing the final left and top values
var left = position.left,
    top = position.top;
```

__EX-3:__ A stupidly complex example explaining the options a bit more detailed.

```javascript
window.popo.set( target, {

  // The syntax here is similar to jQuery UI Position plugin.
  // Format => "targetX targetY baseX baseY"
  position: "center top left bottom",
  
  // A compulsory base elment that defines which element.
  // the target element is positioned against. Defaults to window.
  base: base,
  
  // Define a single offset or multiple offsets
  // separated with comma.
  offset: "12, 30deg -600, -56 98, 1000deg 9",
  
  // Add an autogenerated classname to target element.
  setClass: true,

  // An optional container element that is used for
  // collision detection. Defaults to null. Needs to be defined for
  // onCollision option to have any effect.
  container: container,

  // Define a collision method using one of the formats below with available methods.
  // Formats => "all-sides", "x-axis y-axis", "left-side top-and-bottom-side right-side", "left-side top-side right-side bottom-side"
  // Methods => "none", "push", "push!"
  // Note that alternatively you can define a function for onCollision so you can create your own collision handling method.
  // Function version => onCollision: function (targetPosition, target, base, container) {}
  onCollision: "push! none push push"
  
});
```

## License

Copyright (c) 2013 Niklas Rämö. Licensed under **[the MIT license](https://github.com/niklasramo/popo/blob/master/LICENSE.md)**.
