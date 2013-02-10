$(function(){

  var popo = window.popo,
      $targets = $('.target'),
      containers = [window, window.document, window.document.documentElement, window.document.body],
      transEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';

  function rand(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomPosition() {
    var x = ['left', 'right', 'center'],
        y = ['top', 'bottom', 'center'];
    return rand(x) + ' ' + rand(y) + ' ' + rand(x) + ' ' + rand(y);
  }

  function getRandomOnCollision() {
    var methods = ['push', 'push!', 'none'],
        format1 = rand(methods) + ' ' + rand(methods) + ' ' + rand(methods) + ' ' + rand(methods),
        format2 = rand(methods) + ' ' + rand(methods) + ' ' + rand(methods),
        format3 = rand(methods) + ' ' + rand(methods),
        format4 = rand(methods);
    return rand([format1, format2, format3, format4]);
  }

  function setRandomPosition($el) {
    popo.set($el[0], {
      position: getRandomPosition($el),
      base: rand(containers),
      container: rand(containers),
      setClass: rand([true, false]),
      onCollision: getRandomOnCollision()
    });
  }

  window.setInterval(function () {
    $targets.each(function () {
      setRandomPosition($(this));
    });
  }, 400);

});