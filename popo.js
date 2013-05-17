/*! Popo - v0.9.0dev - 18/5/2013
 * https://github.com/niklasramo/popo
 * Copyright (c) 2012, 2013 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license */

// TODOS
// * Important feature: Programmatically find the "zero" position of a relatively positioned element
// * Speed/size optimization: merge offset/height/width in a smart way so that gbcr does not get called multiple times

(function (window, undefined) {
  'use strict';

  var libName = 'popo',

      // Cache stuff
      doc = window.document,
      toFloat = window.parseFloat,
      math = window.Math,
      mathAbs = math.abs,

      // Cache an object's toString function to later on 
      // use it for identifying the type of an object
      getType = ({}).toString,

      // Cache often used strings
      str_left = 'left',
      str_right = 'right',
      str_top = 'top',
      str_bottom = 'bottom',
      str_center = 'center',
      str_width = 'width',
      str_height = 'height',
      str_function = 'function',
      str_string = 'string',
      str_documentElement = 'documentElement',
      str_body = 'body',
      str_gbcr = 'getBoundingClientRect';

  /**
  * @function   fn_trim
  * @arg        str {String}
  * @returns    {String}
  *
  * A basic function for trimming whitespace of a string. Uses native trim if possible.
  * Checks the argument's type and returns the argument unchanged if it is not string.
  * Based on: http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript/498995#498995
  */
  function fn_trim(str) {

    return typeof str === str_string ? (str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')) : str;

  }

  /**
  * @function   fn_merge
  * @arg        array {Array}
  * @returns    {Object}
  *
  * A function that merges an array of objects into a brand new object.
  * Supports only shallow merge, because deep merge is not needed in this library.
  */
  function fn_merge(array) {

    var obj = {},
        len = array.length,
        i, prop;

    for (i = 0; i < len; i++) {
      for (prop in array[i]) {
        obj[prop] = array[i][prop];
      }
    }

    return obj;

  }

  /**
  * @function   fn_getStyle
  * @arg        el {HtmlElement}
  * @arg        prop {String}
  * @returns    {String}/{null}
  *
  * A crude implementation for getting the computed value of a style property.
  * Based on jQuery source (http://code.jquery.com/jquery-1.9.1.js) and
  * http://www.quirksmode.org/dom/getstyles.html
  */
  function fn_getStyle(el, prop) {

    return window.getComputedStyle ? (
      window.getComputedStyle(el, null).getPropertyValue(prop)
    ) : el.currentStyle ? (
      el.currentStyle[prop]
    ) : (
      null
    );

  }

  /**
  * @function   fn_getOffsetParent
  * @arg        el {HtmlElement}
  * @returns    {HtmlElement}
  *
  * A custom implementation of offsetParent that solves the problems with
  * absolute/fixed positioned elements.
  */
  function fn_getOffsetParent(el) {

    var offsetParent = el.offsetParent,
        pos = 'style' in el && fn_getStyle(el, 'position');

    if (pos == 'fixed') {
      offsetParent = window;
    } else if (pos == 'absolute') {
      offsetParent = el === doc[str_body] ? doc[str_documentElement] : offsetParent || doc;
      while ('style' in offsetParent && fn_getStyle(offsetParent, 'position') == 'static') {
        offsetParent = offsetParent === doc[str_body] ? doc[str_documentElement] : offsetParent.offsetParent || doc;
      }
    }

    return offsetParent;

  }

  /**
  * @function   fn_getWidth
  * @arg        el {HtmlElement}
  * @returns    {Number}
  *
  * A simple function for getting the width of an html element.
  * If the element in question is window, document or documentElement we want
  * to exclude the scrollbar size from the value. In other cases we want the
  * width to include the whole shabang (paddings, borders, scrollbar) except
  * for the margins.
  */
  function fn_getWidth(el) {

    return el === window ? (
      doc[str_documentElement].clientWidth
    ) : el === doc || el === doc[str_documentElement] ? (
      math.max(doc[str_documentElement].scrollWidth, doc[str_body].scrollWidth)
    ) : (
      el[str_gbcr] && str_width in el[str_gbcr]() ? el[str_gbcr]()[str_width] : el.offsetWidth
    );

  }

  /**
  * @function   fn_getHeight
  * @arg        el {HtmlElement}
  * @returns    {Number}
  *
  * A simple function for getting the height of an html element.
  * If the element in question is window, document or documentElement we want
  * to exclude the scrollbar size from the value. In other cases we want the
  * height to include the whole shabang (paddings, borders, scrollbar) except
  * for the margins.
  */
  function fn_getHeight(el) {

    return el === window ? (
      doc[str_documentElement].clientHeight
    ) : el === doc || el === doc[str_documentElement] ? (
      math.max(doc[str_documentElement].scrollHeight, doc[str_body].scrollHeight)
    ) : (
      el[str_gbcr] && str_height in el[str_gbcr]() ? el[str_gbcr]()[str_height] : el.offsetHeight
    );

  }

  /**
  * @function   fn_getOffset
  * @arg        el {HtmlElement}
  * @arg        includeBorders {Boolean}
  * @returns    {Object}
  *
  * A function for getting the left and top offset of an html element. The second argument
  * tells the function to include/exclude the element's border lenght from the offset.
  *
  * This function works like a charm for all elements except the root element
  * (aka the html element aka the documentElement), which throws highly inconsistent
  * data depending on the browser, so we are taking an easy way out here
  * and process the root element as the document and just hope that the user does
  * not give any border, padding or margin to the root element or try to position it
  * in any way. A fix for this problem is direly needed, but it involves a lot of reworking
  * of the whole library, so that is a task for another day.
  */
  function fn_getOffset(el, includeBorders) {

    var offsetLeft = 0,
        offsetTop = 0,
        viewportScrollLeft = window.pageXOffset || doc[str_documentElement].scrollLeft || doc[str_body].scrollLeft || 0,
        viewportScrollTop = window.pageYOffset || doc[str_documentElement].scrollTop || doc[str_body].scrollTop || 0,
        offsetParent = el,
        gbcr;

    if (el === window) {

      offsetLeft = viewportScrollLeft;
      offsetTop = viewportScrollTop;

    } else if (el !== doc && el !== doc[str_documentElement]) {

      gbcr = el[str_gbcr] && el[str_gbcr]();

      if (gbcr && str_left in gbcr && str_top in gbcr) {

        // gbcr based solution (borrowed from jQuery)
        offsetLeft += gbcr[str_left] + viewportScrollLeft - /* IE7 Fix*/ (doc[str_documentElement].clientLeft || 0);
        offsetTop += gbcr[str_top] + viewportScrollTop - /* IE7 Fix*/ (doc[str_documentElement].clientTop || 0);

      } else {

        // gbcr fallback (borrowed from http://www.quirksmode.org/js/findpos.html)
        while (offsetParent) {
          offsetLeft += offsetParent === window ? viewportScrollLeft : offsetParent.offsetLeft || 0;
          offsetTop += offsetParent === window ? viewportScrollTop : offsetParent.offsetTop || 0;
          offsetParent = fn_getOffsetParent(offsetParent);
        }

      }

      if (includeBorders) {
        offsetLeft += el.clientLeft || 0;
        offsetTop += el.clientTop || 0;
      }

    }

    return {
      left: offsetLeft,
      top: offsetTop
    };

  }

  /**
  * @function   fn_getSanitizedOptions
  * @arg        options {Object}
  * @returns    {Object}
  *
  * A function for merging default options with the instance options and sanitizing the result.
  */
  function fn_getSanitizedOptions(options) {

    var i, prop, ret, offset, decimal, item, itemVal1, itemVal2, array, len;

    // Merge instance options with default options
    options = getType.call(options) === '[object Object]' ? fn_merge([window[libName].defaults, options]) : fn_merge([window[libName].defaults]);

    // Loop through options
    for (prop in options) {

      // Handle functions and whitespace in options
      options[prop] = fn_trim(typeof options[prop] !== str_function ? options[prop] : prop == 'onCollision' ? options[prop] : options[prop]());

      // Special handling for position
      if (prop == 'position') {
        options[prop] = options[prop].split(' ');
      }

      // Special handling for offset
      if (prop == 'offset') {

        ret = {x: 0, y: 0};
        offset = typeof options[prop] === str_string ? options[prop].split(',') : [];
        decimal = 1000000;

        for (i = offset.length; i--;) {

          item = fn_trim(offset[i]).split(' ');
          itemVal1 = toFloat(item[0]) || 0;
          itemVal2 = item.length > 1 ? toFloat(item[1]) || 0 : itemVal1;

          if (item[0].indexOf('deg') > -1 && item.length > 1 && itemVal2) {
            ret.x += math.round((math.cos(itemVal1 * (math.PI/180)) * itemVal2) * decimal) / decimal;
            ret.y += math.round((math.sin(itemVal1 * (math.PI/180)) * itemVal2) * decimal) / decimal;
          } else {
            ret.x += itemVal1;
            ret.y += itemVal2;
          }

        }

        options[prop] = ret;

      }

      // Special handling for onCollision
      if (prop == 'onCollision') {

        ret = typeof options[prop] === str_function ? options[prop] : null;

        if (typeof options[prop] === str_string && options[prop].length > 0) {
          array = options[prop].split(' ');
          len = array.length;
          if (len > 0 && len < 5) {
            ret = {
              left: array[0],
              top: len > 1 ? array[1] : array[0],
              right: len > 2 ? array[2] : array[0],
              bottom: len > 3 ? array[3] : len < 2 ? array[0] : array[1]
            };
          }
        }

        options[prop] = ret;

      }

    }

    return options;

  }

  /**
  * @function   fn_getBasePosition
  * @arg        pos {String}
  * @arg        startingPointVal {Number}
  * @arg        baseElemVal {Number}
  * @arg        targetElemVal {Number}
  * @returns    {Number}
  *
  * A function for calculating the base position of an html element.
  */
  function fn_getBasePosition(pos, startingPointVal, baseElemVal, targetElemVal) {

    var positions = {};
    positions[str_left + str_left] = positions[str_top + str_top] = startingPointVal;
    positions[str_left + str_center] = positions[str_top + str_center] = startingPointVal + (baseElemVal / 2);
    positions[str_left + str_right] = positions[str_top + str_bottom] = startingPointVal + baseElemVal;
    positions[str_center + str_left] = positions[str_center + str_top] = startingPointVal - (targetElemVal / 2);
    positions[str_center + str_center] = startingPointVal + (baseElemVal / 2) - (targetElemVal / 2);
    positions[str_center + str_right] = positions[str_center + str_bottom] = startingPointVal + baseElemVal - (targetElemVal / 2);
    positions[str_right + str_left] = positions[str_bottom + str_top] = startingPointVal - targetElemVal;
    positions[str_right + str_center] = positions[str_bottom + str_center] = startingPointVal - targetElemVal + (baseElemVal / 2);
    positions[str_right + str_right] = positions[str_bottom + str_bottom] = startingPointVal - targetElemVal + baseElemVal;
    return positions[pos];

  }

  /**
  * @function   fn_pushOnCollision
  * @arg        onCollision {Object}
  * @arg        targetOverlap {Object}
  * @arg        vertical {Boolean}
  * @returns    {Number}
  *
  * A function for correcting the target element's position if needed. The vertical argument
  * tells the function whether to return y-axis correction or x-axis correction. The returned
  * number is the horizontal/vertical correction in pixels. Do not be fooled by the usage of
  * "left" and "right" in variable names, they reflect "top" and "bottom" when vertical
  * argument is truthy.
  */
  function fn_pushOnCollision(onCollision, targetOverlap, vertical) {

    var ret = 0,
        push = 'push',
        fPush = push + '!',
        left = vertical ? str_top : str_left,
        right = vertical ? str_bottom : str_right,
        leftCollision = onCollision[left],
        rightCollision = onCollision[right],
        leftOverlap = targetOverlap[left],
        rightOverlap = targetOverlap[right],
        sizeDifference = leftOverlap + rightOverlap;

    // If pushing is needed from both sides
    if ((leftCollision == push || leftCollision == fPush) && (rightCollision == push || rightCollision == fPush) && (leftOverlap < 0 || rightOverlap < 0)) {

      // Do push correction from opposite sides with equal force
      if (leftOverlap < rightOverlap) {
        ret -= sizeDifference < 0 ? leftOverlap + mathAbs(sizeDifference / 2) : leftOverlap;
      }
      if (rightOverlap < leftOverlap) {
        ret += sizeDifference < 0 ? rightOverlap + mathAbs(sizeDifference / 2) : rightOverlap;
      }

      // Update overlap data
      leftOverlap += ret;
      rightOverlap -= ret;

      // Check if left/top side forced push correction is needed
      if (leftCollision == fPush && rightCollision != fPush && leftOverlap < 0) {
        ret -= leftOverlap;
      }

      // Check if right/top side forced push correction is needed
      if (rightCollision == fPush && leftCollision != fPush && rightOverlap < 0) {
        ret += rightOverlap;
      }

    // Check if pushing is needed from left or top side only
    } else if ((leftCollision == fPush || leftCollision == push) && leftOverlap < 0) {
      ret -= leftOverlap;

    // Check if pushing is needed from right or bottom side only
    } else if ((rightCollision == fPush || rightCollision == push) && rightOverlap < 0) {
      ret += rightOverlap;
    }

    return ret;

  }

  /**
  * @function   fn_position
  * @arg        element {HtmlElement}
  * @arg        method {String}
  * @arg        options {Object}
  * @returns    {Object}
  *
  * The primary function for controlling the logic and flow of the positioning process.
  */
  function fn_position(element, method, options) {

    // Sanitize options
    options = fn_getSanitizedOptions(typeof method === str_string ? options : method);

        // Cache onCollision option for better minification
    var onCollision = options.onCollision,

        // Get target's data
        targetWidth = fn_getWidth(element),
        targetHeight = fn_getHeight(element),
        targetParentOffset = fn_getOffset(fn_getOffsetParent(element), 1),
        targetOffset, // The offset will be calculated only if onCollision callback is called
        targetOverlap, // Container for target's overlap data
        targetPositionNew, // Container for target's final position

        // Get base element and pre-define base data variables
        baseElement = options.base,
        baseWidth, baseHeight, baseOffset,

        // Get container element and pre-define container data variables
        containerElement = options.container,
        containerWidth, containerHeight, containerOffset;

    // Calculate base element's dimensions and offset
    // If base is an array we assume it's a coordinate
    getType.call(baseElement) === '[object Array]' ? (
      baseWidth = baseHeight = 0,
      baseOffset = fn_getOffset(baseElement[2] || window),
      baseOffset[str_left] += baseElement[0],
      baseOffset[str_top] += baseElement[1]
    ) : (
      baseWidth = fn_getWidth(baseElement),
      baseHeight = fn_getHeight(baseElement),
      baseOffset = fn_getOffset(baseElement)
    );

    // Calculate target element's new position
    targetPositionNew = {
      left: fn_getBasePosition(options.position[0] + options.position[2], baseOffset[str_left] + options.offset.x - targetParentOffset[str_left], baseWidth, targetWidth),
      top: fn_getBasePosition(options.position[1] + options.position[3], baseOffset[str_top] + options.offset.y - targetParentOffset[str_top], baseHeight, targetHeight)
    };

    // If container is defined, let's do some extra calculations and collision handling stuff
    if (containerElement) {

      // Calculate container element's dimensions and offset
      // If container is an array we assume it's a coordinate
      getType.call(containerElement) === '[object Array]' ? (
        containerWidth = containerHeight = 0,
        containerOffset = fn_getOffset(containerElement[2] || window),
        containerOffset[str_left] += containerElement[0],
        containerOffset[str_top] += containerElement[1]
      ) : (
        containerWidth = fn_getWidth(containerElement),
        containerHeight = fn_getHeight(containerElement),
        containerOffset = fn_getOffset(containerElement)
      );

      // Calculate how much target element's sides overlap with the container element's sides
      targetOverlap = {
        left: targetPositionNew[str_left] + targetParentOffset[str_left] - containerOffset[str_left],
        right: (containerOffset[str_left] + containerWidth) - (targetPositionNew[str_left] + targetParentOffset[str_left] + targetWidth),
        top: targetPositionNew[str_top] + targetParentOffset[str_top] - containerOffset[str_top],
        bottom: (containerOffset[str_top] + containerHeight) - (targetPositionNew[str_top] + targetParentOffset[str_top] + targetHeight)
      };

      // If onCollision is a callback function
      if (typeof onCollision === str_function) {

        // Get target's current offset
        targetOffset = fn_getOffset(element);

        // Call the callback function and define the arguments
        onCollision(targetPositionNew, targetOverlap, {
          target: {
            element: element,
            width: targetWidth,
            height: targetHeight,
            offset: targetOffset,
            position: {
              left: targetOffset[str_left] > targetParentOffset[str_left] ? mathAbs(targetOffset[str_left] - targetParentOffset[str_left]) : -mathAbs(targetOffset[str_left] - targetParentOffset[str_left]),
              top: targetOffset[str_top] > targetParentOffset[str_top] ? mathAbs(targetOffset[str_top] - targetParentOffset[str_top]) : -mathAbs(targetOffset[str_top] - targetParentOffset[str_top])
            }
          },
          base: {
            element: baseElement,
            width: baseWidth,
            height: baseHeight,
            offset: baseOffset
          },
          container: {
            element: containerElement,
            width: containerWidth,
            height: containerHeight,
            offset: containerOffset
          }
        });

      // If onCollision uses predefined collision methods
      } else if (onCollision) {

        targetPositionNew[str_left] += fn_pushOnCollision(onCollision, targetOverlap);
        targetPositionNew[str_top] += fn_pushOnCollision(onCollision, targetOverlap, 1);

      }

    }

    // Set or return the final values
    if (method === 'get') {
      return targetPositionNew;
    } else {
      element.style[str_left] = targetPositionNew[str_left] + 'px';
      element.style[str_top] = targetPositionNew[str_top] + 'px';
      return element;
    }

  }

  // Bind popo to global object
  window[libName] = fn_position;
  window[libName].defaults = {
    base: window,
    position: 'center center center center',
    offset: '0',
    container: null,
    onCollision: 'none'
  };

})(window);