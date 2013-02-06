/*!
 * Popo JS - v0.7.4 - 7/2/2013
 *
 * Copyright (c) 2013 Niklas Rämö
 * Released under the MIT license
 */

(function (window, undefined) {

  "use strict";

  /*=================
    Defaults
  =================*/

  var libName = 'popo',
      doc = window.document,
      docElem = doc.documentElement,
      docBody = doc.body,
      m = window.Math,
      getBasePos = {},

      // Define shortcut strings
      l = 'left',
      r = 'right',
      t = 'top',
      b = 'bottom',
      c = 'center',

      // Define shortcut positions
      shortcuts = {
        nw: [r, b, l, t],
        n: [c, b, c, t],
        ne: [l, b, r, t],
        e: [l, c, r, c],
        se: [l, t, r, b],
        s: [c, t, c, b],
        sw: [r, t, l, b],
        w: [r, c, l, c],
        center: [c, c, c, c]
      };

  /*============================
    Base position calculations
  ============================*/

  // Define the base position calculation functions
  // dVal => defaultValue
  // bVal => baseValue
  // tVal => targetValue

  getBasePos[l+l] = getBasePos[t+t] = function (dVal) {
    return dVal;
  };
  getBasePos[l+c] = getBasePos[t+c] = function (dVal, bVal) {
    return dVal + (bVal / 2);
  };
  getBasePos[l+r] = getBasePos[t+b] = function (dVal, bVal) {
    return dVal + bVal;
  };
  getBasePos[c+l] = getBasePos[c+t] = function (dVal, bVal, tVal) {
    return dVal - (tVal / 2);
  };
  getBasePos[c+c] = function (dVal, bVal, tVal) {
    return dVal + (bVal / 2) - (tVal / 2);
  };
  getBasePos[c+r] = getBasePos[c+b] = function (dVal, bVal, tVal) {
    return dVal + bVal - (tVal / 2);
  };
  getBasePos[r+l] = getBasePos[b+t] = function (dVal, bVal, tVal) {
    return dVal - tVal;
  };
  getBasePos[r+c] = getBasePos[b+c] = function (dVal, bVal, tVal) {
    return dVal - tVal + (bVal / 2);
  };
  getBasePos[r+r] = getBasePos[b+b] = function (dVal, bVal, tVal) {
    return dVal - tVal + bVal;
  };

  /*=================
    Functions
  =================*/

  function isWin(el) {

    return Object.prototype.toString.call(el) === '[object global]';

  } // END isWin

  function isDoc(el) {

    return Object.prototype.toString.call(el) === '[object HTMLDocument]';

  } // END isDoc

  function isDocElem(el) {

    return Object.prototype.toString.call(el) === '[object HTMLHtmlElement]';

  } // END isDocElem

  function isDocBody(el) {

    return Object.prototype.toString.call(el) === '[object HTMLBodyElement]';

  } // END isDocBody

  function trim(str) {

    return typeof String.prototype.trim === 'function' ? str.trim() : str.replace(/^\s+|\s+$/g, '');

  } // END trim

  function merge(arr) {

    var obj = {},
        i, prop;

    for (i = 0; i < arr.length; i++) {
      for (prop in arr[i]) {
        obj[prop] = arr[i][prop];
      }
    }
    
    i = prop = null;
    return obj;

  } // END merge

  function getWidth(el) {

    if (isWin(el)) {
      return docElem.clientWidth || docBody.clientWidth;
    } else if (isDoc(el)) {
      return m.max(docElem.clientWidth, docElem.offsetWidth, docElem.scrollWidth, docBody.scrollWidth, docBody.offsetWidth);
    } else {
      return el.getBoundingClientRect().width || el.offsetWidth;
    }

  } // END getWidth

  function getHeight(el) {

    if (isWin(el)) {
      return docElem.clientHeight || docBody.clientHeight;
    } else if (isDoc(el)) {
      return m.max(docElem.clientHeight, docElem.offsetHeight, docElem.scrollHeight, docBody.scrollHeight, docBody.offsetHeight);
    } else {
      return el.getBoundingClientRect().height || el.offsetHeight;
    }

  } // END getHeight

  function getViewportScrollLeft() {

    return typeof window.pageXOffset === 'number' ? window.pageXOffset : docElem.scrollLeft || docBody.scrollLeft;

  } // END getViewportScrollLeft

  function getViewportScrollTop() {

    return typeof window.pageYOffset === 'number' ? window.pageYOffset : docElem.scrollTop || docBody.scrollTop;

  } // END getViewportScrollTop

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
        if (includeBorders) {
          offsetLeft += el.clientLeft;
          offsetTop += el.clientTop;
        }
      }
    }

    rect = null;
    return {left: offsetLeft, top: offsetTop};

  } // END getOffset

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

  } // END getPositionProperty

  function getOffsetParent(el) {

    // This function is designed solely for getting the offset parent of an
    // absolutely positioned element, and used only by getZeroPointOffset function.
    // This could be done a lot simpler and faster, but 

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

  } // END getOffsetParent

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

      // TODO: Make this part more elegant and fast!

      style = el.style;
      left = style.left;
      right = style.right;
      top = style.top;
      bottom = style.bottom;

      // Make sure the element is not affected by left/right/top/bottom properties
      style.left = style.right = style.top = style.bottom = 'auto';

      // Get the element's offset
      offset = getOffset(el);

      // Restore element's original left/right/top/bottom properties
      style.left = left;
      style.right = right;
      style.top = top;
      style.bottom = bottom;

    }

    posProp = style = left = right = top = bottom = null;
    return offset;

  } // END getZeroPointOffset

  function replaceClassName(el, targetStr, newClassName) {

    var classNames = el.className.split(' '),
        len = classNames.length,
        i;

    // Search and remove old PoPo class name from the element
    for (i = 0; i < len; i++) {
      if (classNames[i].substring(0, targetStr.length) === targetStr) {
        classNames.splice(i, 1);
      }
    }

    // Push newClassName to the classNames array
    if (newClassName !== '') {
      classNames.push(newClassName);
    }

    // Update the element's className
    el.className = classNames.join(' ');

    // Null vars
    classNames = len = i = null;

  } // END replaceClassName

  function getSanitizedOnCollision(opt) {

    var arr = typeof opt === 'string' && opt.length !== 0 ? opt.split(' ') : '',
        len = arr.length;

    if (len > 0 && len < 5) {

      // Return sanitized onCollision
      return {
        left: arr[0],
        top: len > 1 ? arr[1] : arr[0],
        right: len > 2 ? arr[2] : arr[0],
        bottom: len === 4 ? arr[3] : (len === 1 ? arr[0] : arr[1])
      };

    } else {

      // Null vars and return null
      arr = len = null;
      return null;

    }

  } // END getSanitizedOnCollision

  function getSanitizedOffset(opt) {

    var offset = {x: 0, y: 0},
        decimal = 1000000,
        items = opt.split(','),
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
        if (typeof ang === 'number' && typeof dist === 'number' && dist !== 0) {
          offset.x += m.round((m.cos(ang * (m.PI/180)) * dist) * decimal) / decimal;
          offset.y += m.round((m.sin(ang * (m.PI/180)) * dist) * decimal) / decimal;
        }

      // If is normal offset
      } else if (itemLen === 1 || itemLen === 2) {
        offset.x += parseFloat(item[0]);
        offset.y += itemLen === 1 ? parseFloat(item[0]) : parseFloat(item[1]);
      }

    }

    // Null vars and return offset
    decimal = items = itemsLen = item = itemLen = ang = dist = i = null;
    return offset;

  } // END getSanitizedOffset

  function getSanitizedOptions(options) {

    var opts = Object.prototype.toString.call(options) === '[object Object]' ? merge([window[libName].defaults, options]) : merge([window[libName].defaults]),
        prop;

    // Trim all strings
    for (prop in opts) {
      if (typeof opts[prop] === 'string') {
        opts[prop] = trim(opts[prop]);
      }
    }

    // Generate class name (if needed)
    if (opts.setClass) {
      opts._className = libName + '-' + opts.position.replace(/\s+/g, '-');
    }

    // Sanitize position
    opts.position = opts.position.split(' ');
    opts.position = opts.position.length === 1 ? shortcuts[opts.position[0]].slice(0) : opts.position;

    // Sanitize offset
    opts.offset = getSanitizedOffset(opts.offset);

    // Sanitize onCollision
    if (opts.container !== null && typeof opts.onCollision !== 'function') {
      opts.onCollision = getSanitizedOnCollision(opts.onCollision);
    }

    // Null vars and return sanitized options
    prop = null;
    return opts;

  } // END getSanitizedOptions

  function getOverflow(target, container) {

    return {
      left: target.position.left + target.zeroPointOffset.left - container.offset.left,
      right: (container.offset.left + container.width) - (target.position.left + target.zeroPointOffset.left + target.width),
      top: target.position.top + target.zeroPointOffset.top - container.offset.top,
      bottom: (container.offset.top + container.height) - (target.position.top + target.zeroPointOffset.top + target.height)
    };

  } // END getOverflow

  function pushOnCollision(opts, target, container) {

    var sides = [['left', 'right'], ['top', 'bottom']],
        side1, side2, i;

    for (i = 0; i < 2; i++) {

      side1 = sides[i][0];
      side2 = sides[i][1];

      if ((opts.onCollision[side1] === 'push' || opts.onCollision[side1] === 'push!') && (opts.onCollision[side2] === 'push' || opts.onCollision[side2] === 'push!') && (container.overflow[side1] < 0 || container.overflow[side2] < 0)) {

        // Push from opposite sides equally
        if (container.overflow[side1] > container.overflow[side2]) {
          if (m.abs(container.overflow[side2]) <= m.abs(container.overflow[side1])) {
            target.position[side1] -= m.abs(container.overflow[side2]);
          } else {
            target.position[side1] -= ((m.abs(container.overflow[side1]) + m.abs(container.overflow[side2])) / 2);
          }
        } else if (container.overflow[side1] < container.overflow[side2]) {
          if (m.abs(container.overflow[side1]) <= m.abs(container.overflow[side2])) {
            target.position[side1] += m.abs(container.overflow[side1]);
          } else {
            target.position[side1] += ((m.abs(container.overflow[side1]) + m.abs(container.overflow[side2])) / 2);
          }
        }

        // Update target's space data
        container.overflow = getOverflow(target, container);

        // Force push one side if needed
        if (opts.onCollision[side1] === 'push!' && container.overflow[side1] < 0) {
          target.position[side1] += m.abs(container.overflow[side1]);
        } else if (opts.onCollision[side2] === 'push!' && container.overflow[side2] < 0) {
          target.position[side1] -= m.abs(container.overflow[side2]);
        }

      } else if ((opts.onCollision[side1] === 'push!' || opts.onCollision[side1] === 'push') && container.overflow[side1] < 0) {

        // Push only from side1 if necessary
        target.position[side1] += m.abs(container.overflow[side1]);

      } else if ((opts.onCollision[side2] === 'push!' || opts.onCollision[side2] === 'push') && container.overflow[side2] < 0) {

        // Push only from side2 if necessary
        target.position[side1] -= m.abs(container.overflow[side2]);

      }

    }

    // Null vars
    sides = side1 = side2 = i = null;

  } // END pushOnCollision

  function position(method, el, options) {

    var opts = getSanitizedOptions(options),
        target = {},
        base = {},
        container = {};

    // Update className if necessary
    if (opts.setClass && (' ' + el.className + ' ').indexOf(' ' + opts._className + ' ') === -1) {
      replaceClassName(el, libName, opts._className);
    }

    // Get target element's dimensions and zero point offset
    target.element = el;
    target.width = getWidth(el);
    target.height = getHeight(el);
    target.zeroPointOffset = getZeroPointOffset(el);

    // Get base element's dimensions and offset
    base.element = opts.base;
    base.width = getWidth(opts.base);
    base.height = getHeight(opts.base);
    base.offset = getOffset(opts.base);

    // Get target position
    target.position = {
      left: getBasePos[opts.position[0] + opts.position[2]](base.offset.left + opts.offset.x - target.zeroPointOffset.left, base.width, target.width),
      top: getBasePos[opts.position[1] + opts.position[3]](base.offset.top + opts.offset.y - target.zeroPointOffset.top, base.height, target.height)
    };

    // If container is defined
    if (opts.container !== null) {

      // Get container dimensions and offset,
      // and calculate how much the target element
      // overflows the container element per side
      container.element = opts.container;
      container.width = getWidth(opts.container);
      container.height = getHeight(opts.container);
      container.offset = getOffset(opts.container);
      container.overflow = getOverflow(target, container);

      // Collision handling (skip if onCollision is null)
      if (typeof opts.onCollision === 'function') {
        opts.onCollision(target, base, container);
      } else if (opts.onCollision !== null) {
        pushOnCollision(opts, target, container);
      }

    }

    // onBeforeExec callback
    if (typeof opts.onBeforeExec === 'function') {
      if (opts.container !== null) {
        container.overflow = getOverflow(target, container);
      }
      opts.onBeforeExec(target, base, container);
    }

    if (method === 'set') {

      // Set target's left and top CSS properties
      el.style.left = target.position.left + 'px';
      el.style.top = target.position.top + 'px';

      // onAfterExec callback
      if (typeof opts.onAfterExec === 'function') {
        if (opts.container !== null) {
          container.overflow = getOverflow(target, container);
        }
        opts.onAfterExec(target, base, container);
      }

      // Null vars
      opts = target = base = container = null;

    } else {

      // Null vars and return target position
      opts = base = container = null;
      return target.position;

    }

  } // END position

  /*==================================
    Publish
  ==================================*/

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
      position: 'center',
      offset: '0',
      base: window,
      container: null,
      onCollision: 'push',
      setClass: false,
      onBeforeExec: null,
      onAfterExec: null
    }
  };

})(window);
