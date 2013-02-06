Popo JS
=======

Popo JS is a stand-alone cross-browser JavaScript library that makes it easy to position elements relative to other elements in various ways. Popo JS is heavily influenced by the awesome jQuery UI Position plugin.

A more extensive documentation and API will be coming up soon...

Examples
========

```javascript

// Get target element and base element
var targetElem = document.getElementById("target"),
    baseElem = document.getElementById("base"),
    containerElem = document.getElementById("container");

// EX-1: Position "#target" element on top of "#base" element
window.popo.set( targetElem, {
  position: "n",
  base: baseElem
});

// EX-2: A stupidly complex example showing off all the options
window.popo.set( targetElem, {
  position: "center top left bottom",
  base: baseElem,
  container: containerElem,
  offset: "12, 30deg -600, -56 98, 1000deg 9",
  collision: "push! none push push",
  setClass: true,
  onBeforeExec: function (target, base, container) {
    
    // This callback function is called just before the final position
    // is set (set method) or returned (get method).

    // Note that you have to define a container element in options
    // in order for the container data to exist.

    // The arguments passed into this function contain all the data
    // that is used for the position calculations. You can manipulate
    // the final positioning inside this function if you want, just
    // get target.position.left and target.position.right and modify
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
    
    // As an example let's mess with the final left and top values
    target.position.top += 10;
    target.position.left -= 800;
    

  },
  onAfterExec: function (targetData, baseData, containerData) {
    
    // This callback function is called right after the final position
    // is set (set method) or returned (get method).

    // Note that you have to define a container element in options
    // in order for the container data to exist.
    
    // Contains same arguments as onBeforeExec callback.
    
    // Only available with set method. Has absolutely no effect if you
    // are using get method.
    
  }
});

```
