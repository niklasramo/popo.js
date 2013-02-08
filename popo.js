/*!
 * Popo JS - v0.7.5 - 8/2/2013
 *
 * Copyright (c) 2013 Niklas Rämö
 * Released under the MIT license
 */

(function (window, undefined) {
  "use strict";

  /*==========
    Defaults
  ==========*/

  var libName = 'popo',
      doc = window.document,
      docElem = doc.documentElement,
      docBody = doc.body,
      math = window.Math,
      mathAbs = math.abs,
      getBasePos = {},

      // A shortcut for stringifying an object
      stringifyObject = Object.prototype.toString,

      // Define shortcut strings
      strLeft = 'left',
      strRight = 'right',
      strTop = 'top',
      strBottom = 'bottom',
      strCenter = 'center',
      strFunction = 'function',
      strNumber = 'number',

      // Define shortcut positions
      shortcuts = {
        nw: [strRight, strBottom, strLeft, strTop],
        n: [strCenter, strBottom, strCenter, strTop],
        ne: [strLeft, strBottom, strRight, strTop],
        e: [strLeft, strCenter, strRight, strCenter],
        se: [strLeft, strTop, strRight, strBottom],
        s: [strCenter, strTop, strCenter, strBottom],
        sw: [strRight, strTop, strLeft, strBottom],
        w: [strRight, strCenter, strLeft, strCenter],
        center: [strCenter, strCenter, strCenter, strCenter]
      };

  /*============================
    Base position calculations
  ============================*/

  getBasePos[strLeft + strLeft] = getBasePos[strTop + strTop] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal;
  };
  getBasePos[strLeft + strCenter] = getBasePos[strTop + strCenter] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal + (baseElemVal / 2);
  };
  getBasePos[strLeft + strRight] = getBasePos[strTop + strBottom] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal + baseElemVal;
  };
  getBasePos[strCenter + strLeft] = getBasePos[strCenter + strTop] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal - (targetElemVal / 2);
  };
  getBasePos[strCenter + strCenter] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal + (baseElemVal / 2) - (targetElemVal / 2);
  };
  getBasePos[strCenter + strRight] = getBasePos[strCenter + strBottom] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal + baseElemVal - (targetElemVal / 2);
  };
  getBasePos[strRight + strLeft] = getBasePos[strBottom + strTop] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal - targetElemVal;
  };
  getBasePos[strRight + strCenter] = getBasePos[strBottom + strCenter] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal - targetElemVal + (baseElemVal / 2);
  };
  getBasePos[strRight + strRight] = getBasePos[strBottom + strBottom] = function (startingPointVal, baseElemVal, targetElemVal) {
    return startingPointVal - targetElemVal + baseElemVal;
  };

  /*===========
    Functions
  ===========*/

  function isWin(el) {

    return stringifyObject.call(el) === '[object global]';

  } // isWin

  function isDoc(el) {

    return stringifyObject.call(el) === '[object HTMLDocument]';

  } // isDoc

  function isDocElem(el) {

    return stringifyObject.call(el) === '[object HTMLHtmlElement]';

  } // isDocElem

  function isDocBody(el) {

    return stringifyObject.call(el) === '[object HTMLBodyElement]';

  } // isDocBody

  function trim(str) {

    return typeof String.prototype.trim === strFunction ? str.trim() : str.replace(/^\s+|\s+$/g, '');

  } // trim

  function merge(arr) {

    var obj = {},
        i, prop;

    for (i = 0; i < arr.length; i++) {
      for (prop in arr[i]) {
        obj[prop] = arr[i][prop];
      }
    }
    
    return obj;

  } // merge

  function getWidth(el) {

    if (isWin(el)) {
      return docElem.clientWidth || docBody.clientWidth;
    } else if (isDoc(el)) {
      return math.max(docElem.clientWidth, docElem.offsetWidth, docElem.scrollWidth, docBody.scrollWidth, docBody.offsetWidth);
    } else {
      return el.getBoundingClientRect().width || el.offsetWidth;
    }

  } // getWidth

  function getHeight(el) {

    if (isWin(el)) {
      return docElem.clientHeight || docBody.clientHeight;
    } else if (isDoc(el)) {
      return math.max(docElem.clientHeight, docElem.offsetHeight, docElem.scrollHeight, docBody.scrollHeight, docBody.offsetHeight);
    } else {
      return el.getBoundingClientRect().height || el.offsetHeight;
    }

  } // getHeight

  function getViewportScrollLeft() {

    return typeof window.pageXOffset === strNumber ? window.pageXOffset : docElem.scrollLeft || docBody.scrollLeft;

  } // getViewportScrollLeft

  function getViewportScrollTop() {

    return typeof window.pageYOffset === strNumber ? window.pageYOffset : docElem.scrollTop || docBody.scrollTop;

  } // getViewportScrollTop

  function getOffset(el, includeBorders) {

    var offsetLeft = 0,
        offsetTop = 0,
        rect;

    if (isWin(el)) {
      offsetLeft = getViewportScrollLeft();
      offsetTop = getViewportScrollTop();
    } else if (!isDoc(el)) {
      rect = el.getBoundingClientRect();
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

  } // getOffset

  function getPositionProperty(el) {

    if (el.style.position) {
      return el.style.position;
    } else if (el.currentStyle) {
      return el.currentStyle.position;
    } else if (doc.defaultView && doc.defaultView.getComputedStyle) {
      return doc.defaultView.getComputedStyle(el, null).getPropertyValue('position');
    } else {
      return 'static';
    }

  } // getPositionProperty

  function getOffsetParent(el) {

    // This function is designed solely for getting the offset parent of an
    // absolutely positioned element, and used only by getZeroPointOffset function.

    var offsetParent;
    if (isDocElem(el)) {
      offsetParent = doc;
    } else if (isDocBody(el)) {
      offsetParent = docElem;
    } else {
      offsetParent = el.offsetParent;
      while (!isDocElem(offsetParent) && getPositionProperty(offsetParent) === 'static') {
        offsetParent = isDocBody(offsetParent) ? docElem : offsetParent.offsetParent;
      }
    }
    return offsetParent;

  } // getOffsetParent

  function getZeroPointOffset(el) {

    var posProp = getPositionProperty(el),
        offset, style, left, right, top, bottom;

    if (posProp === 'fixed') {
      offset = {left: 0, top: 0};
    } else if (posProp === 'absolute') {
      offset = getOffset(getOffsetParent(el), true);
    } else if (posProp !== 'relative') {
      offset = getOffset(el);
    } else {

      // Store original styles
      style = el.style;
      left = style.left;
      right = style.right;
      top = style.top;
      bottom = style.bottom;

      // Reset element's left/right/top/bottom properties
      style.left = style.right = style.top = style.bottom = 'auto';

      // Get the element's offset
      offset = getOffset(el);

      // Restore element's original props
      style.left = left;
      style.right = right;
      style.top = top;
      style.bottom = bottom;

    }

    return offset;

  } // getZeroPointOffset

  function replaceClassName(el, str, newStr) {

    var classNames = el.className.split(' '),
        len = classNames.length,
        i;

    // Remove old classname
    for (i = 0; i < len; i++) {
      if (classNames[i].substring(0, str.length) === str) {
        classNames.splice(i, 1);
      }
    }

    // Add new classname
    if (newStr !== '') {
      classNames.push(newStr);
    }

    // Update classname
    el.className = classNames.join(' ');

  } // replaceClassName

  function getSanitizedOnCollision(option) {

    var arr = typeof option === 'string' && option.length !== 0 ? option.split(' ') : '',
        len = arr.length;

    if (len > 0 && len < 5) {
      return {
        left: arr[0],
        top: len > 1 ? arr[1] : arr[0],
        right: len > 2 ? arr[2] : arr[0],
        bottom: len === 4 ? arr[3] : (len === 1 ? arr[0] : arr[1])
      };
    } else {
      return null;
    }

  } // getSanitizedOnCollision

  function getSanitizedOffset(option) {

    var offset = {x: 0, y: 0},
        decimal = 1000000,
        items = option.split(','),
        itemsLen = items.length,
        item, itemLen, ang, dist, i;

    // Loop through all offset declarations
    for (i = 0; i < itemsLen; i++) {

      // Get offset item and offset item length
      item = trim(items[i]).split(' ');
      itemLen = item.length;

      // If is angle offset
      if (itemLen === 2 && item[0].indexOf('deg') !== -1) {

        // Get angle and distance
        ang = parseFloat(item[0]);
        dist = parseFloat(item[1]);

        // Apply offsets only if the values are even remotely significant
        if (typeof ang === strNumber && typeof dist === strNumber && dist !== 0) {
          offset.x += math.round((math.cos(ang * (math.PI/180)) * dist) * decimal) / decimal;
          offset.y += math.round((math.sin(ang * (math.PI/180)) * dist) * decimal) / decimal;
        }

      // If is normal offset
      } else if (itemLen === 1 || itemLen === 2) {
        offset.x += parseFloat(item[0]);
        offset.y += itemLen === 1 ? parseFloat(item[0]) : parseFloat(item[1]);
      }

    }

    return offset;

  } // getSanitizedOffset

  function getSanitizedOptions(instanceOptions) {

    var opts = stringifyObject.call(instanceOptions) === '[object Object]' ? merge([window[libName].defaults, instanceOptions]) : merge([window[libName].defaults]),
        prop;

    // Trim all strings
    for (prop in opts) {
      if (typeof opts[prop] === 'string') {
        opts[prop] = trim(opts[prop]);
      }
    }

    // Generate class name (if needed)
    if (opts.setClass) {
      opts.cls = libName + '-' + opts.position.replace(/\s+/g, '-');
    }

    // Sanitize position
    opts.position = opts.position.split(' ');
    opts.position = opts.position.length === 1 ? shortcuts[opts.position[0]].slice(0) : opts.position;

    // Sanitize offset
    opts.offset = getSanitizedOffset(opts.offset);

    // Sanitize onCollision
    if (opts.container !== null && typeof opts.onCollision !== strFunction) {
      opts.onCollision = getSanitizedOnCollision(opts.onCollision);
    }

    return opts;

  } // getSanitizedOptions

  function getOverflow(targetWidth, targetHeight, targetPosition, targetZeroPointOffset, containerWidth, containerHeight, containerOffset) {

    return {
      left: targetPosition.left + targetZeroPointOffset.left - containerOffset.left,
      right: (containerOffset.left + containerWidth) - (targetPosition.left + targetZeroPointOffset.left + targetWidth),
      top: targetPosition.top + targetZeroPointOffset.top - containerOffset.top,
      bottom: (containerOffset.top + containerHeight) - (targetPosition.top + targetZeroPointOffset.top + targetHeight)
    };

  } // getOverflow

  function pushOnCollision(targetWidth, targetHeight, targetPosition, targetZeroPointOffset, containerWidth, containerHeight, containerOffset, containerOverflow, onCollision) {

    var push = 'push',
        forcedPush = 'push!',
        sides = [[strLeft, strRight], [strTop, strBottom]],
        leftOrRight, topOrBottom, i;

    for (i = 0; i < 2; i++) {

      leftOrRight = sides[i][0];
      topOrBottom = sides[i][1];

      if ( (onCollision[leftOrRight] === push || onCollision[leftOrRight] === forcedPush) &&
           (onCollision[topOrBottom] === push || onCollision[topOrBottom] === forcedPush) &&
           (containerOverflow[leftOrRight] < 0 || containerOverflow[topOrBottom] < 0)
         ) {

        // Push from opposite sides equally
        if (containerOverflow[leftOrRight] > containerOverflow[topOrBottom]) {
          if (mathAbs(containerOverflow[topOrBottom]) <= mathAbs(containerOverflow[leftOrRight])) {
            targetPosition[leftOrRight] -= mathAbs(containerOverflow[topOrBottom]);
          } else {
            targetPosition[leftOrRight] -= ((mathAbs(containerOverflow[leftOrRight]) + mathAbs(containerOverflow[topOrBottom])) / 2);
          }
        } else if (containerOverflow[leftOrRight] < containerOverflow[topOrBottom]) {
          if (mathAbs(containerOverflow[leftOrRight]) <= mathAbs(containerOverflow[topOrBottom])) {
            target.position[leftOrRight] += mathAbs(containerOverflow[leftOrRight]);
          } else {
            targetPosition[leftOrRight] += ((mathAbs(containerOverflow[leftOrRight]) + mathAbs(containerOverflow[topOrBottom])) / 2);
          }
        }

        // Update container's overflow
        containerOverflow = getOverflow(targetWidth, targetHeight, targetPosition, targetZeroPointOffset, containerWidth, containerHeight, containerOffset);

        // Force push one of the sides if needed
        if (onCollision[leftOrRight] === forcedPush && containerOverflow[leftOrRight] < 0) {
          targetPosition[leftOrRight] += mathAbs(containerOverflow[leftOrRight]);
        } else if (onCollision[topOrBottom] === forcedPush && containerOverflow[topOrBottom] < 0) {
          targetPosition[leftOrRight] -= mathAbs(containerOverflow[topOrBottom]);
        }

      } else if ((onCollision[leftOrRight] === forcedPush || onCollision[leftOrRight] === push) && containerOverflow[leftOrRight] < 0) {

        // Push only from left/right if necessary
        targetPosition[leftOrRight] += mathAbs(containerOverflow[leftOrRight]);

      } else if ((onCollision[topOrBottom] === forcedPush || onCollision[topOrBottom] === push) && containerOverflow[topOrBottom] < 0) {

        // Push only from top/bottom if necessary
        targetPosition[leftOrRight] -= mathAbs(containerOverflow[topOrBottom]);

      }

    }

  } // pushOnCollision

  function position(method, targetElement, instanceOptions) {

    var opts = getSanitizedOptions(instanceOptions),

        // Get target element's data
        targetWidth = getWidth(targetElement),
        targetHeight = getHeight(targetElement),
        targetZeroPointOffset = getZeroPointOffset(targetElement),
        targetPosition,

        // Get base element's data
        baseElement = opts.base,
        baseWidth = getWidth(baseElement),
        baseHeight = getHeight(baseElement),
        baseOffset = getOffset(baseElement),

        // Pre-define container element's data variables
        containerElement,
        containerWidth,
        containerHeight,
        containerOffset,
        containerOverflow,

        // Create data containers and inject initial data
        targetData = {
          element: targetElement,
          width: targetWidth,
          height: targetHeight,
          zeroPointOffset: targetZeroPointOffset
        },
        baseData = {
          element: baseElement,
          width: baseWidth,
          height: baseHeight,
          offset: baseOffset 
        },
        containerData;


    // Update target element's classname if necessary
    if (opts.setClass && (' ' + targetElement.className + ' ').indexOf(' ' + opts.cls + ' ') === -1) {
      replaceClassName(targetElement, libName, opts.cls);
    }

    // Get target position
    targetPosition = targetData.position = {
      left: getBasePos[opts.position[0] + opts.position[2]](baseOffset.left + opts.offset.x - targetZeroPointOffset.left, baseWidth, targetWidth),
      top: getBasePos[opts.position[1] + opts.position[3]](baseOffset.top + opts.offset.y - targetZeroPointOffset.top, baseHeight, targetHeight)
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
      containerOverflow = getOverflow(targetWidth, targetHeight, targetPosition, targetZeroPointOffset, containerWidth, containerHeight, containerOffset);

      // Populate container data object
      containerData = {
        element: containerElement,
        width: containerWidth,
        height: containerHeight,
        offset: containerOffset,
        overflow: containerOverflow
      };

      // Collision handling (skip if onCollision is null)
      if (typeof opts.onCollision === strFunction) {
        opts.onCollision(targetData, baseData, containerData);
      } else if (opts.onCollision !== null) {
        pushOnCollision(targetWidth, targetHeight, targetPosition, targetZeroPointOffset, containerWidth, containerHeight, containerOffset, containerOverflow, opts.onCollision);
      }

    }

    // onExecution callback
    if (typeof opts.onExecution === strFunction) {
      opts.onExecution(targetData, baseData, containerData);
    }

    // Set or return the final values
    if (method === 'set') {
      targetElement.style.left = targetPosition.left + 'px';
      targetElement.style.top = targetPosition.top + 'px';
    } else {
      return targetPosition;
    }

  } // position

  /*=========
    Publish
  =========*/

  // Create methods and default settings
  // and make the library public
  window[libName] = {
    set: function (el, opts) {
      position('set', el, opts);
      return this;
    },
    get: function (el, opts) {
      return position('get', el, opts);
    },
    defaults: {
      position: strCenter,
      offset: '0',
      base: window,
      setClass: false,
      container: null,
      onCollision: 'push',
      onExecution: null
    }
  };

})(window);
