#popo.js

*A JavaScript library for positioning HTML elements*

popo.js is a cross-browser JavaScript library that attempts to simplify the process of positioning HTML elements relative to other HTML elements regardless of their whereabouts in the DOM tree. The library is heavily influenced by **[jQuery UI Position plugin](http://jqueryui.com/position/)**, but does not require jQuery or any other library to work. It's completely stand-alone.

popo.js has been tested on most modern browsers (Chrome, Firefox, Opera, Safari, IE7+) and should be working nicely also on most mobile browsers.

If you're using jQuery or Zepto you might want to grab the [jQuery adapter plugin](jquery.popo.js) also.

##Download

* **[v1.0 - Production](popo.min.js)** (4.1kb minified)
* **[v1.0 - Development](popo.js)** (16.4kb uncompressed)

##Getting started

Include the popo.js script in your site.
```html
<script src="popo.min.js"></script>
```

If you're using jQuery add the jQuery adapter script after popo.js script
```html
<script src="jquery.popo.js"></script>
```

##Usage

```javascript
// The format
popo( element [, method ] [, options ] );

// and with the jQuery adapter
$( element ).popo( [, method ] [, options ] );
```

**element** *(type: element)* *(required)*   
Provide the target element that you want to position.

**method** *(type: string)* *(optional)*   
Provide a method (`set` or `get`). Defaults to `set`, if not specified.

**options** *(type: object)* *(optional)*   
Provide an object containing options. You can change the default options by modifying `popo.defaults`.

##Methods

Name | Description
--- | ---
**set** | <p>Positions the target element by setting the target element's left and top CSS properties according to the position calculations.</p>
**get** | <p>Returns an object containing the calculated position of the target element. The returned object has two properties: <code>left</code> and <code>top</code>.</p>

##Options

Property | Default | Type | Description
--- | --- | --- | ---
**base** | window | *Element, Array* | <p>Defines which element the target element is positioned against. Alternatively you can define a point within an element using the following format: [x-coordinate, y-coordinate, element].</p>
**container** | null | *Element, Array* | <p>Defines an optional container element that is used for collision detection. Alternatively you can define a point within an element using the following format: [x-coordinate, y-coordinate, element].</p>
**position** | "center center center center" | *String* | <p>Defines the target element's position relative to the base element. The format is "targetX targetY baseX baseY". Use `left`, `right` and `center` to describe the horizontal position and `top`, `bottom` and `center` to describe the vertical position.</p>
**offset** | "0" | *String* | <p>Defines a horizontal and a vertical offset in pixels. Accepts a single value or a pair for horizontal/vertical, e.g., "5", "10 -5".
**collision** | "none" | *String, Function* | <p>Defines what to do when one of the target element's sides overflows the container element's matching side. The container element must be defined for this option to have any effect.</p><p>You can use a built-in collision method (`push`, `push+`) or alternatively a callback function which receives almost all of the position data as arguments and create your own collision handling logic.</p><p>Use one of the following formats to define a built-in collision method for each side:<br>"left top right bottom" (e.g. "push push none push+")<br>"left top-bottom right" (e.g. "push none push+")<br>"left-right top-bottom" (e.g. "push none")<br>"left-right-top-bottom". (e.g. "push")</p><p><code>push</code> method tries to keep the targeted sides of the target element within the container element's boundaries. If you assign <code>push</code> method to the opposite sides the force of push will be equal on both sides. If you want to force one of the sides to be always pushed fully inside the container element's area, you can assign a forced push to that side with <code>push+</code> method.</p>

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

__EX-3:__ Using the jQuery adapter

```javascript
$('#target').popo({
  position: "left top right top",
  // Let's give target some offset (5px to right, 10px to bottom).
  offset: '5 -10',
  // Notice that we're providing elements here, not jQuery objects,
  // if you're wondering about the [0] in the end.
  base: $('#base')[0],
  container: $('#container')[0],
  // Let's define a custom collision function that gives us
  // access to the positioning data and let's us manipulate the
  // outcome of the positioning process.
  collision: function(targetPosition, targetOverlap, positionData) {

    // targetPosition is an object which contains the left 
    // and top coordinates of the new position. You can manipulate
    // the left and top property of this object and it will affect the
    // outcome of the positioning.

    // targetPosition.left => left value in pixels
    // targetPosition.top => top value in pixels

    // targetOverlap is an object which tells us how much (in pixels)
    // the target overlaps the container element from each side.

    // targetOverlap.left => left overlap in pixels
    // targetOverlap.right => right overlap in pixels
    // targetOverlap.top => top overlap in pixels
    // targetOverlap.bottom => bottom overlap in pixels

    // positionData object contains all the data 
    // (heights, widths and offsets) that was needed to calculate
    // the stuff in previous objects. Useful for creating your own
    // collision methods if you're not happy with the built-in 
    //'push' and 'push+' methods.

    // positionData.target => target element's data
    // positionData.base => base element's data
    // positionData.container => container element's data

  }
});
```

##Good to know

* Target element's CSS position property must be `absolute` or `fixed`.
* The CSS display property of target, base and container elements must not be `none` during positioning.
* You can position elements within iframes, but you have to make sure that target, base and container elements exist within the same window.
* The target element's margin affects the final position so consider the margin as an extra offset. This is a feature, not a bug. Keep in mind that 'auto' value in margins may cause wonky behaviour.
* popo.js uses the outer width/height (includes scrollbar, borders and padding) of the element when calculating positions. However, in the case of window, document and documentElement the scrollbar width/height is omitted.

##License

Copyright &copy; 2012, 2013 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
