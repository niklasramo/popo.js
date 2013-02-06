#Popo JS

*A JavaScript library for positioning elements*

Popo JS is a stand-alone cross-browser JavaScript library that makes it easy to position elements relative to other elements in various ways. Popo JS is heavily influenced by **[jQuery UI Position plugin](http://jqueryui.com/position/)**.

The goal of Popo JS is making dynamic positioning of html elements as simple and flexible as possible in all modern (and not so modern) browsers. The library has a set of unit tests, which seem to pass fully all the way back to IE7.

**NOTE: Keep in mind that there might be some API changes before v1.0 release.**

##Get started

###Download

* **[v0.7.3 - Production](https://raw.github.com/niklasramo/popo/master/popo.min.js)** (7.1kb minified)
* **[v0.7.3 - Development](https://raw.github.com/niklasramo/popo/master/popo.js)** (16.6kb uncompressed)

Download Popo JS library and include it in your HTML Document, preferrably inside the head tag.

```html
<script src="popo.min.js"></script>
```

###Know the prequisites

* Target's CSS position property must be *relative*, *absolute* or *fixed*.
* The CSS display property of target, base and container must not be *none*.

###Start using

Popo has two methods: <code>get</code> and <code>set</code>. The set method sets the target element's left and top values while the get method only calculates and returns the values. Both methods require the target element as the first argument. Additionally you can provide an options object as the second argument.

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
**position** | "n" | *String* | <p>Defines the target element's position relative to the base element. The format is "targetX targetY baseX baseY". A horizontal position can be `left`, `right` or `center` while a vertical position can be `top`, `bottom` or `center`.</p><p>Alternatively, you can use a single shortcut value: `nw`, `n`, `ne`, `e`, `se`, `s`, `sw`, `w`, `center`.</p>
**offset** | "0" | *String* | <p>Defines a horizontal and a vertical offset (in pixels). For basic usage provide the option with a string containing two numbers (e.g. "-12 90"). The format is "offsetX offsetY". One number will be used for both offsets (e.g. "10").</p><p>For a bit more advanced usage you can define an angular offset by providing the option with an angle in degrees and a distance in pixels (e.g. "120deg 300"). Note that the first value must have the trailing "deg" string for Popo to identify the offset as an angular offset. Also note that zero degrees points to east.</p><p>For even more advanced usage you can provide the option with multiple offsets by separating the different offsets with a comma (e.g. "12, 30deg -600, -56 98, 1000deg 9").</p>
**base** | window | *Element* | <p>Defines which element the target element is positioned against.</p>
**container** | null | *Element* | <p>Defines an optional container element that is used for collision detection.</p>
**onCollision** | "push" | *String, Function* | <p>Defines what to do when the target element overflows the container element. The container element must be defined for this option to have any effect. You can either define a built-in collision method for each side with the format "left top right bottom" (e.g. "push none none push") or pass in a function and use this option as a callback function. The format for using built-in collision methods is "left top right bottom".</p><p>Popo has two built-in collision methods, <code>push</code> and <code>push!</code>, <code>none</code> will skip collision handling.</p><p><code>push</code> method tries to keep the targeted sides of the target element within the container element's boundaries. If you assign <code>push</code> method to the opposite sides the force of push will be equal on both sides. If you want to force one of the sides to be always pushed fully inside the container element's area, you can assign a forced push to that side with <code>push!</code> method.</p>
**setClass** | true | *Boolean* | <p>If true, a class name (constructed out of the library name and the position option string) will be automatically added to the target element. The format is "libName-positionOptionValue", all empty spaces are replaced with dashes. For example, if the position option value is "left top right center" the constructed class name would be "popo-left-top-right-center".</p>
**onBeforeExec** | null | *Function* | <p>Defines a callback function for get and set methods that is executed just before the the positioning.</p>
**onAfterExec** | null | *Function* | <p>Defines a callback function for set method that is executed right after the positioning.</p>

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

  // The syntax here is similar to jQuery UI Position plugin
  // => "targetX targetY baseX baseY"
  position: "center top left bottom",
  
  // A compulsory base elment that defines which element
  // the target element is positioned against. Defaults to window.
  base: base,
  
  // An optional container element that is used for
  // collision detection. Defaults to null.
  container: container,
  
  // Define a single offset or multiple offsets
  // separated with comma.
  offset: "12, 30deg -600, -56 98, 1000deg 9",
  
  // Define a collision method for each side
  // => "left top right bottom"
  // Methods: "none", "push", "push!"
  onCollision: "push! none push push",
  
  // Add an autogenerated className to target
  setClass: true,

  // A callback function which is called just before the final position
  // is set (with set method) or returned (with get method)
  onBeforeExec: function (target, base, container) {

    // The three arguments available in this function contain all the data
    // that is used for the position calculations. You can manipulate
    // the final position inside this function if you want, just
    // get target.position.left and target.position.top and modify
    // their values as you wish.

    // Note that you have to define a container element in options
    // in order for the container argument to exist in this function.
    
    // The arguments opened up
    // =======================
    
    // target.element
    // target.width
    // target.height
    // target.ZeroPointOffset.left
    // target.ZeroPointOffset.top
    // target.position.left => the final left value
    // target.position.top  => the final top value
    
    // base.element
    // base.width
    // base.height
    // base.offset.left
    // base.offset.top

    // container.element
    // container.width
    // container.height
    // container.offset.left
    // container.offset.top
    // container.overflow.left
    // container.overflow.right
    // container.overflow.top
    // container.overflow.bottom
    
    // For demonstration purposes let's adjust the final left and top values
    target.position.top += 10;
    target.position.left -= 800;

  },

  // A callback function which is called just before the final position
  // is set (with set method)
  onAfterExec: function (target, base, container) {

    // Only available when using set method. Has absolutely no effect if you
    // are using get method. Note also that you have to define a container 
    // element in options in order for the container argument to exist in 
    // this function.
    
    // Contains same arguments as onBeforeExec callback.
    
  }
});
```

## License

Copyright (c) 2013 Niklas Rämö. Licensed under **[the MIT license](https://github.com/niklasramo/popo/blob/master/LICENSE.md)**.
