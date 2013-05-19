/*! popo.js - v0.9 - 19/5/2013
 * https://github.com/niklasramo/popo
 * Copyright (c) 2012, 2013 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license */

(function (window, undefined) {
  'use strict';

  var libName = 'popo',

    // Cache stuff
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
    str_gbcr = 'getBoundingClientRect',

    // Placeholders for instance specific elements
    win, doc, docElem, body;


  /**
  * @function   fn_isWin
  * @arg        el {HtmlElement}
  * @returns    {Boolean}
  *
  * Check if the element is the instance window object. Uses "self" property
  * to compare the objcts to counter an IE6-IE8 specific problem.
  */
  function fn_isWin(el) {

    return el.self === win.self;

  }

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

    return win.getComputedStyle ? (
      win.getComputedStyle(el, null).getPropertyValue(prop)
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

    if (pos === 'fixed') {
      offsetParent = win;
    } else if (pos === 'absolute') {
      offsetParent = el === body ? docElem : offsetParent || doc;
      while ('style' in offsetParent && fn_getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent === body ? docElem : offsetParent.offsetParent || doc;
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

    return fn_isWin(el) ? (
      docElem.clientWidth
    ) : el === doc || el === docElem ? (
      math.max(docElem.scrollWidth, body.scrollWidth)
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

    return fn_isWin(el) ? (
      docElem.clientHeight
    ) : el === doc || el === docElem ? (
      math.max(docElem.scrollHeight, body.scrollHeight)
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
  * This function works like a charm for all elements except for the documentElement,
  * which outputs inconsistent data depending on the browser. So we are taking a rather
  * easy way out here and process the root element as the document and hope that the user does
  * not give any border, padding or margin to the documentElement or try to position it
  * in any way.
  */
  function fn_getOffset(el, includeBorders) {

    var offsetLeft = 0,
      offsetTop = 0,
      viewportScrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft || 0,
      viewportScrollTop = win.pageYOffset || docElem.scrollTop || body.scrollTop || 0,
      offsetParent = el,
      gbcr;

    if (fn_isWin(el)) {

      offsetLeft = viewportScrollLeft;
      offsetTop = viewportScrollTop;

    } else if (el !== doc && el !== docElem) {

      gbcr = el[str_gbcr] && el[str_gbcr]();

      if (gbcr && str_left in gbcr && str_top in gbcr) {

        // gbcr based solution (borrowed from jQuery)
        offsetLeft += gbcr[str_left] + viewportScrollLeft - /* IE7 Fix*/ (docElem.clientLeft || 0);
        offsetTop += gbcr[str_top] + viewportScrollTop - /* IE7 Fix*/ (docElem.clientTop || 0);

      } else {

        // gbcr fallback (borrowed from http://www.quirksmode.org/js/findpos.html)
        while (offsetParent) {
          offsetLeft += fn_isWin(offsetParent) ? viewportScrollLeft : offsetParent.offsetLeft || 0;
          offsetTop += fn_isWin(offsetParent) ? viewportScrollTop : offsetParent.offsetTop || 0;
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
  * A function for merging and sanitizing the default options with the instance options.
  */
  function fn_getSanitizedOptions(el, options) {

    var defaultOptions = window[libName].defaults,
      prop, i, ret, offset, decimal, item, itemVal1, itemVal2, array, len;

    // Merge options with default options
    options = getType.call(options) === '[object Object]' ? fn_merge([defaultOptions, options]) : fn_merge([defaultOptions]);

    // Loop through options
    for (prop in options) {

      // Handle functions and whitespace in options
      options[prop] = fn_trim(typeof options[prop] !== str_function ? options[prop] : prop === 'onCollision' ? options[prop] : options[prop](el));

      // Special handling for position
      if (prop === 'position') {
        options[prop] = options[prop].split(' ');
      }

      // Special handling for offset
      if (prop === 'offset') {
        ret = {x: 0, y: 0};
        offset = typeof options[prop] === str_string ? options[prop].split(',') : [];
        decimal = 1e6;
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
      if (prop === 'onCollision') {
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
  * A function for calculating the base position of an element.
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
  * number is the horizontal/vertical correction in pixels.
  */
  function fn_pushOnCollision(onCollision, targetOverlap, vertical) {

    var ret = 0,
      push = 'push',
      forcePush = push + '!',
      side1 = vertical ? str_top : str_left,
      side2 = vertical ? str_bottom : str_right,
      side1_collision = onCollision[side1],
      side2_collision = onCollision[side2],
      side1_overlap = targetOverlap[side1],
      side2_overlap = targetOverlap[side2],
      sizeDifference = side1_overlap + side2_overlap;

    // If pushing is needed from both sides
    if ((side1_collision === push || side1_collision === forcePush) && (side2_collision === push || side2_collision === forcePush) && (side1_overlap < 0 || side2_overlap < 0)) {

      // Do push correction from opposite sides with equal force
      if (side1_overlap < side2_overlap) {
        ret -= sizeDifference < 0 ? side1_overlap + mathAbs(sizeDifference / 2) : side1_overlap;
      }
      if (side2_overlap < side1_overlap) {
        ret += sizeDifference < 0 ? side2_overlap + mathAbs(sizeDifference / 2) : side2_overlap;
      }

      // Update overlap data
      side1_overlap += ret;
      side2_overlap -= ret;

      // Check if left/top side forced push correction is needed
      if (side1_collision === forcePush && side2_collision != forcePush && side1_overlap < 0) {
        ret -= side1_overlap;
      }

      // Check if right/top side forced push correction is needed
      if (side2_collision === forcePush && side1_collision != forcePush && side2_overlap < 0) {
        ret += side2_overlap;
      }

    // Check if pushing is needed from left or top side only
    } else if ((side1_collision === forcePush || side1_collision === push) && side1_overlap < 0) {
      ret -= side1_overlap;

    // Check if pushing is needed from right or bottom side only
    } else if ((side2_collision === forcePush || side2_collision === push) && side2_overlap < 0) {
      ret += side2_overlap;
    }

    return ret;

  }

  /**
  * @function   fn_position
  * @arg        el {HtmlElement}
  * @arg        method {String}
  * @arg        options {Object}
  * @returns    {Object}
  *
  * The primary function for controlling the logic and flow of the positioning process.
  */
  function fn_position(el, method, options) {

    // Assign instance specific window, document, documentElement and body.
    // Enables usage of popo within other windows in addition to the initial window.
    doc = el.ownerDocument;
    win = doc.defaultView || doc.parentWindow;
    docElem = doc.documentElement;
    body = doc.body;

    // Sanitize options
    options = fn_getSanitizedOptions(el, typeof method === str_string ? options : method);

    // Cache onCollision option for better minification
    var onCollision = options.onCollision,

      // Containers for target's final position and overlap data
      targetPositionNew,
      targetOverlap,

      // Target's offset will be calculated only if onCollision callback function
      // is called. It's not required for the calculations, but serves as useful
      // data for possible additional position calculations.
      targetOffset,

      // Get target's data
      targetWidth = fn_getWidth(el),
      targetHeight = fn_getHeight(el),
      targetParentOffset = fn_getOffset(fn_getOffsetParent(el), 1),

      // Get base element and predefine base data variables
      baseElement = options.base,
      baseWidth,
      baseHeight,
      baseOffset,

      // Get container element and predefine container data variables
      containerElement = options.container,
      containerWidth,
      containerHeight,
      containerOffset;

    // Calculate base element's dimensions and offset
    // If base is an array we assume it's a coordinate
    getType.call(baseElement) === '[object Array]' ? (
      baseWidth = baseHeight = 0,
      baseOffset = fn_getOffset(baseElement[2] || win),
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

    // If container is defined, let's do some extra calculations and possibly collision correction
    if (containerElement) {

      // Calculate container element's dimensions and offset
      // If container is an array we assume it's a coordinate
      getType.call(containerElement) === '[object Array]' ? (
        containerWidth = containerHeight = 0,
        containerOffset = fn_getOffset(containerElement[2] || win),
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
        targetOffset = fn_getOffset(el);

        // Call onCollision callback function with special arguments
        onCollision(targetPositionNew, targetOverlap, {
          target: {
            element: el,
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
      el.style[str_left] = targetPositionNew[str_left] + 'px';
      el.style[str_top] = targetPositionNew[str_top] + 'px';
      return el;
    }

  }

  // Bind the library to global object
  window[libName] = fn_position;
  window[libName].defaults = {
    base: function (el, elDoc) {
      elDoc = el.ownerDocument;
      return elDoc.defaultView || elDoc.parentWindow;
    },
    position: 'center center center center',
    offset: '0',
    container: null,
    onCollision: 'none'
  };

})(window);