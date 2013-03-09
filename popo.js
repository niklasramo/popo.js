/*!
 * Popo JS - v0.8.1 - 9/3/2013
 * Copyright (c) 2013 Niklas Rämö <inramo@gmail.com>
 * Released under the MIT license
 */

(function (window, undefined) {

  "use strict";

  /*===========
    Variables
  ============*/

  var libName = 'popo',

      // Cache the containing window's document
      doc = window.document,

      // Cache Math object and Math.abs function
      math = Math,
      mathAbs = math.abs,

      // Cache often used strings
      str_left = 'left',
      str_right = 'right',
      str_top = 'top',
      str_bottom = 'bottom',
      str_center = 'center',
      str_function = 'function',
      str_documentElement = 'documentElement',
      str_body = 'body',

      // Create a shortcut for getting the stringified type of an object
      getStringifiedType = Object.prototype.toString;

  /*===========
    Functions
  ===========*/

  /**
  * @function   trim
  * @param      str {String}
  * @returns    {String}
  *
  * A basic function for trimming whitespace of a string. Uses native trim if possible.
  * Based on: http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript/498995#498995
  */
  function trim(str) {

    return String.prototype.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');

  }

  /**
  * @function   merge
  * @param      array {Array}
  * @returns    {Object}
  *
  * A function that merges an array of objects into a brand new object.
  * Supports only shallow merge, because deep merge is not needed in this library.
  */
  function merge(array) {

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
  * @function   getStyle
  * @param      el {HtmlElement}
  * @param      prop {String}
  * @returns    {String}/null
  *
  * A crude implementation for getting the computed value of a style property.
  * Based on jQuery source (http://code.jquery.com/jquery-1.9.1.js) and
  * http://www.quirksmode.org/dom/getstyles.html
  */
  function getStyle(el, prop) {

    return window.getComputedStyle ? (
      window.getComputedStyle(el, null).getPropertyValue(prop)
    ) : el.currentStyle ? (
      el.currentStyle[prop]
    ) : (
      null
    );

  }

  /**
  * @function   getOffsetParent
  * @param      el {HtmlElement}
  * @returns    {HtmlElement}
  *
  * A custom implementation of offsetParent and tailored for the use in this library specifically.
  * Adresses the issue that body element's and html element's  offsetParent returns usually
  * undefined/null. Also for fixed elements the offsetParent should be window in all cases in order
  * for the calculations in this library to return correct results.
  */
  function getOffsetParent(el) {

    var elemPos = getStyle(el, 'position'),
        offsetParent = el.offsetParent;

    if (elemPos === 'fixed') {
      offsetParent = window;
    } else if (elemPos === 'absolute') {
      offsetParent = el === doc[str_body] ? doc[str_documentElement] : offsetParent || doc;
      while (offsetParent !== doc && getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent === doc[str_body] ? doc[str_documentElement] : offsetParent.offsetParent || doc;
      }
    }

    return offsetParent;

  }

  /**
  * @function   getWidth
  * @param      el {HtmlElement}
  * @returns    {Number}
  *
  * A simple function for getting the width of an html element.
  * If the element in question is window, document or documentElement we want
  * to exclude the scrollbar size from the value. In other cases we want the
  * width to include the whole shabang (paddings, borders, scrollbar) except
  * for the margins.
  */
  function getWidth(el) {

    return el === window ? (
      doc[str_documentElement].clientWidth
    ) : el === doc || el === doc[str_documentElement] ? (
      math.max(doc[str_documentElement].scrollWidth, doc[str_body].scrollWidth)
    ) : (
      el.getBoundingClientRect().width || el.offsetWidth
    );

  }

  /**
  * @function   getHeight
  * @param      el {HtmlElement}
  * @returns    {Number}
  *
  * A simple function for getting the height of an html element.
  * If the element in question is window, document or documentElement we want
  * to exclude the scrollbar size from the value. In other cases we want the
  * height to include the whole shabang (paddings, borders, scrollbar) except
  * for the margins.
  */
  function getHeight(el) {

    return el === window ? (
      doc[str_documentElement].clientHeight
    ) : el === doc || el === doc[str_documentElement] ? (
      math.max(doc[str_documentElement].scrollHeight, doc[str_body].scrollHeight)
    ) : (
      el.getBoundingClientRect().height || el.offsetHeight
    );

  }

  /**
  * @function   getOffset
  * @param      el {HtmlElement}
  * @param      includeBorders {Boolean}
  * @returns    {Object}
  *
  * A function for getting the left and top offset of an html element. The second parameter
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
  function getOffset(el, includeBorders) {

    var offsetLeft = 0,
        offsetTop = 0,
        viewportScrollLeft = window.pageXOffset || doc[str_documentElement].scrollLeft || doc[str_body].scrollLeft || 0,
        viewportScrollTop = window.pageYOffset || doc[str_documentElement].scrollTop || doc[str_body].scrollTop || 0,
        rect, offsetParent;

    if (el === window) {

      offsetLeft = viewportScrollLeft;
      offsetTop = viewportScrollTop;

    } else if (el !== doc && el !== doc[str_documentElement]) {

      rect = el.getBoundingClientRect();

      if (rect && typeof rect[str_left] === 'number' && typeof rect[str_top] === 'number') {

        // The logic below is borrowed straight from jQuery core so a humble
        // thank you is in place here =)
        offsetLeft += rect[str_left] + viewportScrollLeft - /* IE7 Fix*/ doc[str_documentElement].clientLeft;
        offsetTop += rect[str_top] + viewportScrollTop - /* IE7 Fix*/ doc[str_documentElement].clientTop;

      } else {

        // Experimental fallback for gbcr, probably needs a bit more tweaking and testing
        // Thanks to PPK for the basic idea: http://www.quirksmode.org/js/findpos.html
        offsetLeft += el.offsetLeft || 0;
        offsetTop += el.offsetTop || 0;
        offsetParent = getOffsetParent(el);
        while (offsetParent) {
          offsetLeft += offsetParent === window ? viewportScrollLeft : offsetParent.offsetLeft || 0;
          offsetTop += offsetParent === window ? viewportScrollTop : offsetParent.offsetTop || 0;
          offsetParent = getOffsetParent(offsetParent);
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
  * @function   getSanitizedOffset
  * @param      offsetOption {String}
  * @returns    {Object}
  *
  * A function for sanitizing the offset option and calculating the
  * total horizontal and vertical offset that needs to be added
  * to or removed from the final left/top position values.
  */
  function getSanitizedOffset(offsetOption) {

    var offset = {x: 0, y: 0},
        toFloat = parseFloat,
        decimal = 1000000,
        items = typeof offsetOption === str_function ? trim(offsetOption()).split(',') : offsetOption.split(','),
        itemsLen = items.length,
        item, itemLen, ang, dist, i;

    // Loop through all offset declarations
    for (i = 0; i < itemsLen; i++) {

      // Get offset item and offset item length
      item = trim(items[i]).split(' ');
      itemLen = item.length;

      // If is angle offset
      if (itemLen === 2 && item[0].indexOf('deg') >= 0) {

        // Get angle and distance
        ang = toFloat(item[0]);
        dist = toFloat(item[1]);

        // Apply offsets only if the values are even remotely significant
        if (typeof ang === 'number' && typeof dist === 'number' && dist !== 0) {
          offset.x += math.round((math.cos(ang * (math.PI/180)) * dist) * decimal) / decimal;
          offset.y += math.round((math.sin(ang * (math.PI/180)) * dist) * decimal) / decimal;
        }

      // If is normal offset
      } else if (itemLen === 1 || itemLen === 2) {
        offset.x += toFloat(item[0]);
        offset.y += itemLen === 1 ? toFloat(item[0]) : toFloat(item[1]);
      }

    }

    return offset;

  }

  /**
  * @function   getSanitizedOnCollision
  * @param      onCollisionOption {String}
  * @returns    {Object}/null
  *
  * A function for sanitizing the onCollision option. Transforms the string value into an object
  * that contains left/top/right/bottom parameters. If the string value can not be validated
  * the function returns null.
  */
  function getSanitizedOnCollision(onCollisionOption) {

    var array = typeof onCollisionOption === 'string' && onCollisionOption.length > 0 ? onCollisionOption.split(' ') : '',
        len = array.length;

    if (len > 0 && len < 5) {
      return {
        left: array[0],
        top: len > 1 ? array[1] : array[0],
        right: len > 2 ? array[2] : array[0],
        bottom: len === 4 ? array[3] : len === 1 ? array[0] : array[1]
      };
    } else {
      return null;
    }

  }

  /**
  * @function   getSanitizedOptions
  * @param      instanceOptions {Object}
  * @returns    {Object}
  *
  * A function for sanitizing all options. Merges the global default options with 
  * the instance options and tries to validate all options except for onCollision
  * option.
  */
  function getSanitizedOptions(instanceOptions) {

    var opts = getStringifiedType.call(instanceOptions) === '[object Object]' ? merge([window[libName].defaults, instanceOptions]) : merge([window[libName].defaults]),
        prop;

    // Trim all strings
    for (prop in opts) {
      if (typeof opts[prop] === 'string') {
        opts[prop] = trim(opts[prop]);
      }
    }

    // Sanitize options
    opts.position = typeof opts.position === str_function ? opts.position().split(' ') : opts.position.split(' ');
    opts.base = typeof opts.base === str_function ? opts.base() : opts.base;
    opts.container = typeof opts.container === str_function ? opts.container() : opts.container;
    opts.offset = getSanitizedOffset(opts.offset);

    return opts;

  }

  /**
  * @function   getBasePosition
  * @param      pos {String}
  * @param      startingPointVal {Number}
  * @param      baseElemVal {Number}
  * @param      targetElemVal {Number}
  * @returns    {Number}
  *
  * A function for calculating the base position of an html element.
  */
  function getBasePosition(pos, startingPointVal, baseElemVal, targetElemVal) {

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
  * @function   pushOnCollision
  * @param      onCollision {Object}
  * @param      targetOverlap {Object}
  * @param      vertical {Boolean}
  * @returns    {Number}
  *
  * A function for correcting the target element's position if needed. The vertical parameter
  * tells the function whether to return y-axis correction or x-axis correction. The returned
  * number is the horizontal/vertical correction in pixels.
  */
  function pushOnCollision(onCollision, targetOverlap, vertical) {

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
  * @function   position
  * @param      method {String}
  * @param      targetElement {HtmlElement}
  * @param      instanceOptions {Object}
  * @returns    {Object}
  *
  * A function for controlling the logic and flow of the positioning process.
  * Sets the final left/top CSS property values to the target element if the
  * method parameter is "set". In other cases the function returns an object
  * containing the final values.
  */
  function position(targetElement, instanceOptions, setPosition) {

    var opts = getSanitizedOptions(instanceOptions),
        onCollision = opts.onCollision,

        // Container for position data object used in onCollision callback
        positionData,

        // Get target's data
        targetWidth = getWidth(targetElement),
        targetHeight = getHeight(targetElement),
        targetParentOffset = getOffset(getOffsetParent(targetElement), 1),
        targetOffset, // The offset will be calculated only if onCollision callback is called
        targetOverlap, // Container for target's overlap data
        targetPositionNew, // Container for target's final position

        // Get base element and pre-define base data variables
        baseElement = opts.base,
        baseWidth, baseHeight, baseOffset,

        // Get container element and pre-define container data variables
        containerElement = opts.container,
        containerWidth, containerHeight, containerOffset;

    // Calculate base element's dimensions and offset
    // If base is an array we assume it's a coordinate
    getStringifiedType.call(baseElement) === '[object Array]' ? (
      baseWidth = baseHeight = 0,
      baseOffset = getOffset(baseElement[2] || window),
      baseOffset[str_left] += baseElement[0],
      baseOffset[str_top] += baseElement[1]
    ) : (
      baseWidth = getWidth(baseElement),
      baseHeight = getHeight(baseElement),
      baseOffset = getOffset(baseElement)
    );

    // Calculate target element's new position
    targetPositionNew = {
      left: getBasePosition(opts.position[0] + opts.position[2], baseOffset[str_left] + opts.offset.x - targetParentOffset[str_left], baseWidth, targetWidth),
      top: getBasePosition(opts.position[1] + opts.position[3], baseOffset[str_top] + opts.offset.y - targetParentOffset[str_top], baseHeight, targetHeight)
    };

    // If container is defined, let's do some extra calculations and collision handling stuff
    if (containerElement) {

      // Calculate container element's dimensions and offset
      // If container is an array we assume it's a coordinate
      getStringifiedType.call(containerElement) === '[object Array]' ? (
        containerWidth = containerHeight = 0,
        containerOffset = getOffset(containerElement[2] || window),
        containerOffset[str_left] += containerElement[0],
        containerOffset[str_top] += containerElement[1]
      ) : (
        containerWidth = getWidth(containerElement),
        containerHeight = getHeight(containerElement),
        containerOffset = getOffset(containerElement)
      );

      // Calculate how much target element's sides overlap with the container element's sides
      targetOverlap = {
        left: targetPositionNew[str_left] + targetParentOffset[str_left] - containerOffset[str_left],
        right: (containerOffset[str_left] + containerWidth) - (targetPositionNew[str_left] + targetParentOffset[str_left] + targetWidth),
        top: targetPositionNew[str_top] + targetParentOffset[str_top] - containerOffset[str_top],
        bottom: (containerOffset[str_top] + containerHeight) - (targetPositionNew[str_top] + targetParentOffset[str_top] + targetHeight)
      };

      // If onCollision option is a callback function
      if (typeof onCollision === str_function) {

        // Get target's current offset
        targetOffset = getOffset(targetElement);

        // Create positionData object for onCollision callback
        positionData = {
          target: {
            element: targetElement,
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
        };

        // Call the callback function and define the arguments
        onCollision(targetPositionNew, targetOverlap, positionData);

      // If onCollision option is not a callback function
      } else {

        // Sanitize onCollision option and check if the target's position needs correction
        onCollision = getSanitizedOnCollision(onCollision);
        if (onCollision) {
          targetPositionNew[str_left] += pushOnCollision(onCollision, targetOverlap);
          targetPositionNew[str_top] += pushOnCollision(onCollision, targetOverlap, 1);
        }

      }

    }

    // Set or return the final values
    if (setPosition) {
      targetElement.style[str_left] = targetPositionNew[str_left] + 'px';
      targetElement.style[str_top] = targetPositionNew[str_top] + 'px';
      return window;
    } else {
      return targetPositionNew;
    }

  }

  /*=========
    Unleash
  =========*/

  // Bind the library to window object and
  // define public methods and default options
  window[libName] = {
    set: function (el, opts) {
      return position(el, opts, 1);
    },
    get: function (el, opts) {
      return position(el, opts);
    },
    defaults: {
      base: window,
      position: 'center center center center',
      offset: '0',
      container: null,
      onCollision: 'push'
    }
  };

})(window);