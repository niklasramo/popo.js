/*!
 * Popo JS - v0.8.1 - 5/3/2013
 *
 * Copyright (c) 2013 Niklas Rämö
 * Released under the MIT license
 */

(function (window, undefined) {

  "use strict";

  var libName = 'popo',

      // Cache some elements and global functions
      doc = window.document,
      docElem = doc.documentElement,
      body = doc.body,
      math = Math,
      mathAbs = math.abs,
      toFloat = parseFloat,

      // Cache repeating strings and object keys (for better compression)
      str_left = 'left',
      str_right = 'right',
      str_top = 'top',
      str_bottom = 'bottom',
      str_center = 'center',
      str_function = 'function',

      // A shortcut for getting the stringified type of an object
      getStringifiedType = Object.prototype.toString;

  /*===========
    Functions
  ===========*/

  function trim(str) {

    return typeof String.prototype.trim === str_function ? str.trim() : str.replace(/^\s+|\s+$/g, '');

  }

  function merge(arr) {

    var obj = {},
        len = arr.length,
        i, prop;

    for (i = 0; i < len; i++) {
      for (prop in arr[i]) {
        obj[prop] = arr[i][prop];
      }
    }

    return obj;

  }

  function getStyle(el, prop) {

    return window.getComputedStyle ? (
      window.getComputedStyle(el, null).getPropertyValue(prop)
    ) : el.currentStyle ? (
      el.currentStyle[prop]
    ) : (
      null
    );

  }

  function getWidth(el) {

    return el === window ? (
      docElem.clientWidth
    ) : el === doc || el === docElem ? (
      math.max(docElem.scrollWidth, body.scrollWidth)
    ) : (
      el.getBoundingClientRect().width || el.offsetWidth
    );

  }

  function getHeight(el) {

    return el === window ? (
      docElem.clientHeight
    ) : el === doc || el === docElem ? (
      math.max(docElem.scrollHeight, body.scrollHeight)
    ) : (
      el.getBoundingClientRect().height || el.offsetHeight
    );

  }

  function getOffset(el, includeBorders) {

    // This function is pretty much borrowed from jQuery core so a humble
    // nod with gratitude is in place here =)

    var offsetLeft = offsetTop = 0,
        viewportScrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        viewportScrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
        rect, offsetParent;

    if (el === window) {

      offsetLeft = viewportScrollLeft;
      offsetTop = viewportScrollTop;

    } else if (el !== doc && el !== docElem) {

      // The logic below works beautifully for all elements in almost
      // all browsers (IE7+). The only exception is the html element,
      // which outputs inconsistent gbcr, clientLeft and clientTop values
      // depending on the browser. For that reason the logic below assumes
      // that the html element has zero left/top offset and no left/top border.

      rect = el.getBoundingClientRect();

      if (rect) {

        offsetLeft += rect[str_left] + viewportScrollLeft - /* IE7 Fix */docElem.clientLeft;
        offsetTop += rect[str_top] + viewportScrollTop - /* IE7 Fix */docElem.clientTop;

      } else {

        // Experimental fallback based on: http://www.quirksmode.org/js/findpos.html
        // Not working yet

        offsetLeft += el.offsetLeft || 0;
        offsetTop += el.offsetTop || 0;
        offsetParent = getOffsetParent(el);

        if (offsetParent) {
          while (offsetParent) {
            offsetLeft += el.offsetLeft;
            offsetTop += el.offsetTop;
            offsetParent = getOffsetParent(el);
          }
        }

      }

      if (includeBorders) {
        offsetLeft += el.clientLeft;
        offsetTop += el.clientTop;
      }

    }

    return {
      left: offsetLeft,
      top: offsetTop
    };

  }

  function getOffsetParent(el) {

    var elemPos = getStyle(el, 'position'),
        offsetParent = el.offsetParent;

    if (elemPos === 'fixed') {
      offsetParent = window;
    } else if (elemPos === 'absolute') {
      offsetParent = el === body ? docElem : offsetParent || doc;
      while (offsetParent !== doc && getStyle(offsetParent, 'position') === 'static') {
        offsetParent = offsetParent === body ? docElem : offsetParent.offsetParent || doc;
      }
    }

    return offsetParent;

  }

  function getSanitizedOffset(offsetOption) {

    var offset = {x: 0, y: 0},
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

  function getSanitizedOnCollision(onCollisionOption) {

    var arr = typeof onCollisionOption === 'string' && onCollisionOption.length > 0 ? onCollisionOption.split(' ') : '',
        len = arr.length;

    if (len > 0 && len < 5) {
      return {
        left: arr[0],
        top: len > 1 ? arr[1] : arr[0],
        right: len > 2 ? arr[2] : arr[0],
        bottom: len === 4 ? arr[3] : len === 1 ? arr[0] : arr[1]
      };
    } else {
      return null;
    }

  }

  function getPreSanitizedOptions(instanceOptions) {

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

  function getOverlap(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset) {

    return {
      left: targetPosition[str_left] + targetParentOffset[str_left] - containerOffset[str_left],
      right: (containerOffset[str_left] + containerWidth) - (targetPosition[str_left] + targetParentOffset[str_left] + targetWidth),
      top: targetPosition[str_top] + targetParentOffset[str_top] - containerOffset[str_top],
      bottom: (containerOffset[str_top] + containerHeight) - (targetPosition[str_top] + targetParentOffset[str_top] + targetHeight)
    };

  }

  function pushOnCollision(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset, targetOverlap, onCollision) {

    // TODO: Remove dependency from getOverlap function
    // TODO: Make this function return the values instead of setting them

    var push = 'push',
        forcedPush = 'push!',
        sides = [[str_left, str_right], [str_top, str_bottom]],
        leftOrTop, rightOrBottom, i;

    for (i = 0; i < 2; i++) {

      leftOrTop = sides[i][0];
      rightOrBottom = sides[i][1];

      // If pushing is needed from both sides
      if ( (onCollision[leftOrTop] === push || onCollision[leftOrTop] === forcedPush) &&
           (onCollision[rightOrBottom] === push || onCollision[rightOrBottom] === forcedPush) &&
           (targetOverlap[leftOrTop] < 0 || targetOverlap[rightOrBottom] < 0)
         ) {

        // Push from opposite sides equally
        if (targetOverlap[leftOrTop] > targetOverlap[rightOrBottom]) {
          if (mathAbs(targetOverlap[rightOrBottom]) <= mathAbs(targetOverlap[leftOrTop])) {
            targetPosition[leftOrTop] -= mathAbs(targetOverlap[rightOrBottom]);
          } else {
            targetPosition[leftOrTop] -= ((mathAbs(targetOverlap[leftOrTop]) + mathAbs(targetOverlap[rightOrBottom])) / 2);
          }
        } else if (targetOverlap[leftOrTop] < targetOverlap[rightOrBottom]) {
          if (mathAbs(targetOverlap[leftOrTop]) <= mathAbs(targetOverlap[rightOrBottom])) {
            targetPosition[leftOrTop] += mathAbs(targetOverlap[leftOrTop]);
          } else {
            targetPosition[leftOrTop] += ((mathAbs(targetOverlap[leftOrTop]) + mathAbs(targetOverlap[rightOrBottom])) / 2);
          }
        }

        // Update target's overlap
        targetOverlap = getOverlap(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset);

        // Force push one of the sides if needed
        if (onCollision[leftOrTop] === forcedPush && targetOverlap[leftOrTop] < 0) {
          targetPosition[leftOrTop] += mathAbs(targetOverlap[leftOrTop]);
        } else if (onCollision[rightOrBottom] === forcedPush && targetOverlap[rightOrBottom] < 0) {
          targetPosition[leftOrTop] -= mathAbs(targetOverlap[rightOrBottom]);
        }

      // If pushing is needed from left or top side only, push it!
      } else if ((onCollision[leftOrTop] === forcedPush || onCollision[leftOrTop] === push) && targetOverlap[leftOrTop] < 0) {
        targetPosition[leftOrTop] += mathAbs(targetOverlap[leftOrTop]);

      // If pushing is needed from right or bottom side only, push it!
      } else if ((onCollision[rightOrBottom] === forcedPush || onCollision[rightOrBottom] === push) && targetOverlap[rightOrBottom] < 0) {
        targetPosition[leftOrTop] -= mathAbs(targetOverlap[rightOrBottom]);
      }

    }

  }

  function position(method, targetElement, instanceOptions) {

    var opts = getPreSanitizedOptions(instanceOptions),
        onCollision = opts.onCollision,

        // Containers for target's (yet to be) calculated data 
        targetPositionNew,
        targetOverlapNew,

        // Get target's current data
        targetWidth = getWidth(targetElement),
        targetHeight = getHeight(targetElement),
        targetParentOffset = getOffset(getOffsetParent(targetElement), true),
        targetOffset,

        // Get base element and pre-define base data variables
        baseElement = opts.base,
        baseWidth,
        baseHeight,
        baseOffset,

        // Get container element and pre-define container data variables
        containerElement = opts.container,
        containerWidth,
        containerHeight,
        containerOffset;

    // Calculate base element's dimensions and offset.
    // If base is an array we assume it's a coordinate.
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

      // Calculate container element's dimensions and offset.
      // If container is an array we assume it's a coordinate.
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
      targetOverlapNew = getOverlap(targetWidth, targetHeight, targetPositionNew, targetParentOffset, containerWidth, containerHeight, containerOffset);

      // If onCollision option is a callback function
      if (typeof onCollision === str_function) {

        // Get target's current offset
        targetOffset = getOffset(targetElement);

        // Call the callback function and define the arguments
        onCollision(targetPositionNew, targetOverlapNew, {
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
        });

      // If onCollision option is not a callback function
      } else {

        // Sanitize onCollision
        onCollision = getSanitizedOnCollision(onCollision);

        // If onCollision passed sanitation run the calculated position through pre-defined collision methods
        if (onCollision) {
          pushOnCollision(targetWidth, targetHeight, targetPositionNew, targetParentOffset, containerWidth, containerHeight, containerOffset, targetOverlapNew, onCollision);
        }

      }

    }

    // Set or return the final values
    if (method === 'set') {
      targetElement.style[str_left] = targetPositionNew[str_left] + 'px';
      targetElement.style[str_top] = targetPositionNew[str_top] + 'px';
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
      position('set', el, opts);
      return this;
    },
    get: function (el, opts) {
      return position('get', el, opts);
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