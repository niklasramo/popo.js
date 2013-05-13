#Popo JS

*A JavaScript library for positioning elements*

Popo JS is a stand-alone cross-browser (Chrome, Opera, Firefox, Safari, IE7+) JavaScript library that makes it easy to position elements relative to other elements in various ways. Popo JS is heavily influenced by **[jQuery UI Position plugin](http://jqueryui.com/position/)**.

**NOTE: Keep in mind that there might be some drastic API changes before v1.0 release.**

##Get started

###Download

* **[v0.9 - Production](https://raw.github.com/niklasramo/popo/master/popo.min.js)** (4kb minified)
* **[v0.9 - Development](https://raw.github.com/niklasramo/popo/master/popo.js)** (21kb uncompressed)

Download Popo JS library and include it in your HTML Document.

```html
<script src="popo.min.js"></script>
```

###Learn about the prequisites

* Target element's CSS position property must be *absolute* or *fixed*. Positioning *relative* elements is not supported yet, but it is planned for 1.0 release.
* The CSS display property of target element, base element and container element must not be *none*.
* The target element's margin affects the final position calculated by Popo (this is a feature not a bug).
* Popo uses the outer width/height (includes scrollbar, borders and padding) of an html element when calculating positions. However, for window object, document object and the root element (documentElement) the scrollbar size is omitted.

##Usage

```javascript
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
**base** | window | *Element, Array* | <p>Defines which element the target element is positioned against.</p><p>Alternatively you can define a coordinate by providing an array containining the coordinates and an element that is used as the parent element for the coordinates. The format is: [x-coordinate, y-coordinate, element]. The coordinates must be numbers (integers or floats) and the element must be a DOM element, the document object or the window object.</p>
**position** | "center center center center" | *String* | <p>Defines the target element's position relative to the base element. The format is "targetX targetY baseX baseY". Use `left`, `right` and `center` to describe the horizontal position and `top`, `bottom` and `center` to describe the vertical position.</p>
**offset** | "0" | *String* | <p>Defines a horizontal and a vertical offset (in pixels). For basic usage provide the option with a string containing two numbers (e.g. "-12 90"). The format is "offsetX offsetY". One number will be used for both offsets (e.g. "10").</p><p>For a bit more advanced usage you can define an angular offset by providing the option with an angle in degrees and a distance in pixels (e.g. "120deg 300"). Note that the first value must have the trailing "deg" string for Popo to identify the offset as an angular offset. Also note that zero degrees points to east.</p><p>For even more advanced usage you can provide the option with multiple offsets by separating the different offsets with a comma (e.g. "12, 30deg -600, -56 98, 1000deg 9").</p>
**container** | null | *Element* | <p>Defines an optional container element that is used for collision detection.</p>
**onCollision** | "push" | *String, Function* | <p>Defines what to do when the target element overflows the container element. The container element must be defined for this option to have any effect. You can either define a built-in collision method for each side with the format "left top right bottom" (e.g. "push none none push") or pass in a function and use this option as a callback function.</p><p>Popo has two built-in collision methods, <code>push</code> and <code>push!</code>, <code>none</code> will skip collision handling.</p><p><code>push</code> method tries to keep the targeted sides of the target element within the container element's boundaries. If you assign <code>push</code> method to the opposite sides the force of push will be equal on both sides. If you want to force one of the sides to be always pushed fully inside the container element's area, you can assign a forced push to that side with <code>push!</code> method.</p>

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
// The get method returns an object containing the final left and top values
var position = popo(document.getElementById("target"), 'get', {
  position: "left top right center",
  base: document.getElementById("base")
});

// position.left => returns the final left position of target element 
// position.top => returns the final top position of target element
```

## License

Copyright (c) 2013 Niklas Rämö. Licensed under **[the MIT license](https://github.com/niklasramo/popo/blob/master/LICENSE.md)**.
