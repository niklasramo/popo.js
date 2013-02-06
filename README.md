Popo JS
=======

Popo JS is a stand-alone cross-browser JavaScript library that makes it easy to position elements relative to other elements in various ways. Popo JS is heavily influenced by the awesome jQuery UI Position plugin.

A more extensive documentation and API will be coming up soon...

Setting up
==========

Just include Popo JS library in your HTML Document and you're good to go.

```html
<script src="popo.min.js"></script>
```

Examples
========

To make the examples a bit easier on the eyes, let's assume that you have stored target element, base element and container element in variables. Note that Popo has no built-in selector engine, which is fully intentional.

```javascript
var target = document.getElementById("target"),
    base = document.getElementById("base"),
    container = document.getElementById("container");
```

EX-1: Use "set" method to position target on top of base.

```javascript
window.popo.set( target, {
  position: "n",
  base: base,
});
```

EX-2: Use "get" method to retrieve target's position without actually positioning the target.

```javascript
var position = window.popo.get( target, {
  position: "n",
  base: base,
});

// The get method returns and object containing the final left and top values
var left = position.left,
    top = position.top;
```

EX-3: A stupidly complex example showing off all the options and explaining how the callbacks work

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
  collision: "push! none push push",
  
  // Add an autogenerated className to target
  setClass: true,

  // This callback function is called just before the final position
  // is set (set method) or returned (get method)
  onBeforeExec: function (target, base, container) {

    // Note that you have to define a container element in options
    // in order for the container data to exist.

    // The arguments passed into this function contain all the data
    // that is used for the position calculations. You can manipulate
    // the final positioning inside this function if you want, just
    // get target.position.left and target.position.top and modify
    // their values as you wish.
    
    // The arguments data API
    // ======================
    
    // target.element
    // target.width
    // target.height
    // target.ZeroPointOffset.left
    // target.ZeroPointOffset.top
    // target.position.left => the final left value is at your mercy
    // target.position.top  => the final top value is at your mercy
    
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
    
    // For demonstration let's adjust the final left and top values
    target.position.top += 10;
    target.position.left -= 800;

  },

  // This callback function is called right after the final position
  // is set (with set method) or returned (with get method)
  onAfterExec: function (target, base, container) {

    // Note that you have to define a container element in options
    // in order for the container data to exist.
    
    // Contains same arguments as onBeforeExec callback.
    
    // Only available with set method. Has absolutely no effect if you
    // are using get method.
    
  }
});
```
