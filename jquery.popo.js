/*!
 * jQuery adapter for popo.js v0.1
 * http://github.com/niklasramo/popo
 * Copyright (c) 2012, 2013 Niklas Rämö
 * Released under the MIT license
 * Date: 2013-08-14
 */

(function ($) {
  $.fn.popo = function (method, options) {
    if (method === 'get') {
      return popo(this[0], method, options);
    } else {
      return this.each(function () {
        popo(this, method, options);
      });
    }
  };
})(self.jQuery || self.Zepto);
