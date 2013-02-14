/*!
 * Popo JS - v0.7.8 - 12/2/2013
 *
 * Copyright (c) 2013 Niklas Rämö
 * Released under the MIT license
 */

(function (window, undefined) {

  "use strict";

  var libName = 'popo',

      // Cache some elements
      doc = window.document,
      docElem = doc.documentElement,
      body = doc.body,

      // Cache some math functions
      math = window.Math,
      mathAbs = math.abs,

      // Cache repeating strings and object keys (for better compression)
      str_left = 'left',
      str_right = 'right',
      str_top = 'top',
      str_bottom = 'bottom',
      str_center = 'center',
      str_function = 'function',
      str_number = 'number',
      str_getBoundingClientRect = 'getBoundingClientRect',
      str_clientWidth = 'clientWidth',
      str_clientHeight = 'clientHeight',

      // A shortcut for getting the stringified type of an object
      getStringifiedType = Object.prototype.toString,

      // Define shortcut positions
      shortcuts = {
        nw: [str_right, str_bottom, str_left, str_top],
        n: [str_center, str_bottom, str_center, str_top],
        ne: [str_left, str_bottom, str_right, str_top],
        e: [str_left, str_center, str_right, str_center],
        se: [str_left, str_top, str_right, str_bottom],
        s: [str_center, str_top, str_center, str_bottom],
        sw: [str_right, str_top, str_left, str_bottom],
        w: [str_right, str_center, str_left, str_center],
        center: [str_center, str_center, str_center, str_center]
      };

  /*===========
    Functions
  ===========*/

  function trim(str) {

    return typeof String.prototype.trim === str_function ? str.trim() : str.replace(/^\s+|\s+$/g, '');

  }

  function merge(arr) {

    var obj = {},
        i, prop;

    for (i = 0; i < arr.length; i++) {
      for (prop in arr[i]) {
        obj[prop] = arr[i][prop];
      }
    }

    return obj;

  }

  function getWidth(el) {

    return el === window ? (
      docElem[str_clientWidth] || body[str_clientWidth]
    ) : el === doc ? (
      math.max(docElem[str_clientWidth], docElem.offsetWidth, docElem.scrollWidth, body.scrollWidth, body.offsetWidth)
    ) : (
      el[str_getBoundingClientRect]().width || el.offsetWidth
    );

  }

  function getHeight(el) {

    return el === window ? (
      docElem[str_clientHeight] || body[str_clientHeight]
    ) : el === doc ? (
      math.max(docElem[str_clientHeight], docElem.offsetHeight, docElem.scrollHeight, body.scrollHeight, body.offsetHeight)
    ) : (
      el[str_getBoundingClientRect]().height || el.offsetHeight
    );

  }

  function getViewportScrollLeft() {

    return typeof window.pageXOffset === str_number ? window.pageXOffset : docElem.scrollLeft || body.scrollLeft;

  }

  function getViewportScrollTop() {

    return typeof window.pageYOffset === str_number ? window.pageYOffset : docElem.scrollTop || body.scrollTop;

  }

  function getOffset(el, includeBorders) {

    var offsetLeft = 0,
        offsetTop = 0,
        rect;

    if (el === window) {

      offsetLeft = getViewportScrollLeft();
      offsetTop = getViewportScrollTop();

    } else if (el !== doc) {

      rect = el[str_getBoundingClientRect]();
      if (typeof rect !== 'undefined') {
        offsetLeft = rect.left + getViewportScrollLeft();
        offsetTop = rect.top  + getViewportScrollTop();
        if (includeBorders === true) {
          offsetLeft += el.clientLeft;
          offsetTop += el.clientTop;
        }
      }

    }

    return {left: offsetLeft, top: offsetTop};

  }

  function getPositionProperty(el) {

    return el.style.position ? (
      el.style.position
    ) : el.currentStyle ? (
      el.currentStyle.position
    ) : doc.defaultView && doc.defaultView.getComputedStyle ? (
      doc.defaultView.getComputedStyle(el, null).getPropertyValue('position')
    ) : (
      'static'
    );

  }

  function getOffsetParent(el) {

    var offsetParent;
    if (el === docElem) {
      offsetParent = doc;
    } else if (el === body) {
      offsetParent = docElem;
    } else {
      offsetParent = el.offsetParent;
      while (offsetParent !== docElem && getPositionProperty(offsetParent) === 'static') {
        offsetParent = offsetParent === body ? docElem : offsetParent.offsetParent;
      }
    }
    return offsetParent;

  }

  function getParentOffset(el) {

    var posProp = getPositionProperty(el),
        offset, style, left, right, top, bottom;

    posProp === 'fixed' ? (
      offset = {left: 0, top: 0}
    ) : posProp === 'absolute' ? (
      offset = getOffset(getOffsetParent(el), true)
    ) : posProp !== 'relative' ? (
      offset = getOffset(el)
    ) : (

      // Store original styles
      style = el.style,
      left = style.left,
      right = style.right,
      top = style.top,
      bottom = style.bottom,

      // Reset element's left/right/top/bottom properties
      style.left = style.right = style.top = style.bottom = 'auto',

      // Get the element's offset
      offset = getOffset(el),

      // Restore element's original props
      style.left = left,
      style.right = right,
      style.top = top,
      style.bottom = bottom

    );

    return offset;

  }

  function getSanitizedPosition(positionOption) {

    var pos = typeof positionOption === str_function ? trim(positionOption()).split(' ') : positionOption.split(' ');
    return pos.length === 1 ? shortcuts[pos[0]].slice(0) : pos;

  }

  function getSanitizedOffset(offsetOption) {

    var offset = {x: 0, y: 0},
        decimal = 1000000, 
        items = typeof offsetOption === str_function ? trim(offsetOption()).split(',') : offsetOption.split(','),
        itemsLen = items.length,
        toFloat = window.parseFloat,
        item, itemLen, ang, dist, i;

    // Loop through all offset declarations
    for (i = 0; i < itemsLen; i++) {

      // Get offset item and offset item length
      item = trim(items[i]).split(' ');
      itemLen = item.length;

      // If is angle offset
      if (itemLen === 2 && item[0].indexOf('deg') !== -1) {

        // Get angle and distance
        ang = toFloat(item[0]);
        dist = toFloat(item[1]);

        // Apply offsets only if the values are even remotely significant
        if (typeof ang === str_number && typeof dist === str_number && dist !== 0) {
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

    var arr = typeof onCollisionOption === 'string' && onCollisionOption.length !== 0 ? onCollisionOption.split(' ') : '',
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

    // Sanitize position
    opts.position = getSanitizedPosition(opts.position);

    // Sanitize offset
    opts.offset = getSanitizedOffset(opts.offset);

    // Sanitize base element
    opts.base = typeof opts.base === str_function ? opts.base() : opts.base;

    // Sanitize container
    opts.container = typeof opts.container === str_function ? opts.container() : opts.container;

    // NOTE!
    // onCollision sanitation happens in position function and only if needed,
    // meaning only if container is defined.

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

  function getOverflow(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset) {

    return {
      left: targetPosition.left + targetParentOffset.left - containerOffset.left,
      right: (containerOffset.left + containerWidth) - (targetPosition.left + targetParentOffset.left + targetWidth),
      top: targetPosition.top + targetParentOffset.top - containerOffset.top,
      bottom: (containerOffset.top + containerHeight) - (targetPosition.top + targetParentOffset.top + targetHeight)
    };

  }

  function pushOnCollision(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset, containerOverflow, onCollision) {

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
           (containerOverflow[leftOrTop] < 0 || containerOverflow[rightOrBottom] < 0)
         ) {

        // Push from opposite sides equally
        if (containerOverflow[leftOrTop] > containerOverflow[rightOrBottom]) {
          if (mathAbs(containerOverflow[rightOrBottom]) <= mathAbs(containerOverflow[leftOrTop])) {
            targetPosition[leftOrTop] -= mathAbs(containerOverflow[rightOrBottom]);
          } else {
            targetPosition[leftOrTop] -= ((mathAbs(containerOverflow[leftOrTop]) + mathAbs(containerOverflow[rightOrBottom])) / 2);
          }
        } else if (containerOverflow[leftOrTop] < containerOverflow[rightOrBottom]) {
          if (mathAbs(containerOverflow[leftOrTop]) <= mathAbs(containerOverflow[rightOrBottom])) {
            targetPosition[leftOrTop] += mathAbs(containerOverflow[leftOrTop]);
          } else {
            targetPosition[leftOrTop] += ((mathAbs(containerOverflow[leftOrTop]) + mathAbs(containerOverflow[rightOrBottom])) / 2);
          }
        }

        // Update container's overflow
        containerOverflow = getOverflow(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset);

        // Force push one of the sides if needed
        if (onCollision[leftOrTop] === forcedPush && containerOverflow[leftOrTop] < 0) {
          targetPosition[leftOrTop] += mathAbs(containerOverflow[leftOrTop]);
        } else if (onCollision[rightOrBottom] === forcedPush && containerOverflow[rightOrBottom] < 0) {
          targetPosition[leftOrTop] -= mathAbs(containerOverflow[rightOrBottom]);
        }

      // If pushing is needed from left or top side only, push it!
      } else if ((onCollision[leftOrTop] === forcedPush || onCollision[leftOrTop] === push) && containerOverflow[leftOrTop] < 0) {
        targetPosition[leftOrTop] += mathAbs(containerOverflow[leftOrTop]);

      // If pushing is needed from right or bottom side only, push it!
      } else if ((onCollision[rightOrBottom] === forcedPush || onCollision[rightOrBottom] === push) && containerOverflow[rightOrBottom] < 0) {
        targetPosition[leftOrTop] -= mathAbs(containerOverflow[rightOrBottom]);
      }

    }

  }

  function position(method, targetElement, instanceOptions) {

    var opts = getPreSanitizedOptions(instanceOptions),
        onCollision = opts.onCollision,

        // Pre-define target element's data vars
        targetWidth = getWidth(targetElement),
        targetHeight = getHeight(targetElement),
        targetParentOffset = getParentOffset(targetElement),
        targetPosition,

        // Pre-define base element's data vars
        baseElement = opts.base,
        baseWidth,
        baseHeight,
        baseOffset,

        // Pre-define container element's data vars
        containerElement,
        containerWidth,
        containerHeight,
        containerOffset,
        containerOverflow;

    // Calculate base element's dimensions and offset.
    // If base is an array we assume it's a coordinate.
    getStringifiedType.call(opts.base) === '[object Array]' ? (
      baseWidth = baseHeight = 0,
      baseOffset = getOffset(baseElement[2] || window),
      baseOffset.left += baseElement[0],
      baseOffset.top += baseElement[1]
    ) : (
      baseWidth = getWidth(baseElement),
      baseHeight = getHeight(baseElement),
      baseOffset = getOffset(baseElement)
    );

    // Get target position
    targetPosition = {
      left: getBasePosition(opts.position[0] + opts.position[2], baseOffset.left + opts.offset.x - targetParentOffset.left, baseWidth, targetWidth),
      top: getBasePosition(opts.position[1] + opts.position[3], baseOffset.top + opts.offset.y - targetParentOffset.top, baseHeight, targetHeight)
    };

    // If container is defined
    if (opts.container !== null) {

      // Get container dimensions and offset,
      // and calculate how much the target element
      // overflows the container on each side
      containerElement = opts.container;
      containerWidth = getWidth(containerElement);
      containerHeight = getHeight(containerElement);
      containerOffset = getOffset(containerElement);
      containerOverflow = getOverflow(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset);

      // Collision handling (skip if onCollision is null)
      if (typeof onCollision === str_function) {
        onCollision(targetPosition, {
          target: {
            element: targetElement,
            width: targetWidth,
            height: targetHeight,
            offset: {
              x: targetParentOffset.x + targetPosition.x,
              y: targetParentOffset.y + targetPosition.y
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
            offset: containerOffset,
            overflow: containerOverflow
          }
        });
      } else {
        onCollision = getSanitizedOnCollision(onCollision);
        if (onCollision !== null) {
          pushOnCollision(targetWidth, targetHeight, targetPosition, targetParentOffset, containerWidth, containerHeight, containerOffset, containerOverflow, onCollision);
        }
      }

    }

    // Set or return the final values
    if (method === 'set') {
      targetElement.style.left = targetPosition.left + 'px';
      targetElement.style.top = targetPosition.top + 'px';
    } else {
      return targetPosition;
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
      position: str_center,
      offset: '0',
      base: window,
      container: null,
      onCollision: 'push'
    }
  };

})(window);