
//
// GLOBALS
//

var result, expected, prop, i, temp,
    ltIE8 = $('html').hasClass('lt-ie8'),
    positionStyles = ltIE8 ? ['absolute'] : ['absolute', 'fixed'],
    $wrapper = $('#test-wrapper'),
    wrapper = $wrapper[0],
    $target = $('#test-target'),
    target = $target[0],
    $base = $('#test-base'),
    base = $base[0],
    $container = $('#test-container'),
    container = $container[0],
    positions = {

      /* Stack 1 */

      left_top_left_top: {name: 'left top left top', left: 10, top: 10},
      center_top_left_top: {name: 'center top left top', left: 5, top: 10},
      right_top_left_top: {name: 'right top left top', left: 0, top: 10},

      left_center_left_top: {name: 'left center left top', left: 10, top: 5},
      center_center_left_top: {name: 'center center left top', left: 5, top: 5},
      right_center_left_top: {name: 'right center left top', left: 0, top: 5},

      left_bottom_left_top: {name: 'left bottom left top', left: 10, top: 0},
      center_bottom_left_top: {name: 'center bottom left top', left: 5, top: 0},
      right_bottom_left_top: {name: 'right bottom left top', left: 0, top: 0},

      left_top_center_top: {name: 'left top center top', left: 15, top: 10},
      center_top_center_top: {name: 'center top center top', left: 10, top: 10},
      right_top_center_top: {name: 'right top center top', left: 5, top: 10},

      left_center_center_top: {name: 'left center center top', left: 15, top: 5},
      center_center_center_top: {name: 'center center center top', left: 10, top: 5},
      right_center_center_top: {name: 'right center center top', left: 5, top: 5},

      left_bottom_center_top: {name: 'left bottom center top', left: 15, top: 0},
      center_bottom_center_top: {name: 'center bottom center top', left: 10, top: 0},
      right_bottom_center_top: {name: 'right bottom center top', left: 5, top: 0},

      left_top_right_top: {name: 'left top right top', left: 20, top: 10},
      center_top_right_top: {name: 'center top right top', left: 15, top: 10},
      right_top_right_top: {name: 'right top right top', left: 10, top: 10},

      left_center_right_top: {name: 'left center right top', left: 20, top: 5},
      center_center_right_top: {name: 'center center right top', left: 15, top: 5},
      right_center_right_top: {name: 'right center right top', left: 10, top: 5},

      left_bottom_right_top: {name: 'left bottom right top', left: 20, top: 0},
      center_bottom_right_top: {name: 'center bottom right top', left: 15, top: 0},
      right_bottom_right_top: {name: 'right bottom right top', left: 10, top: 0},

      /* Stack 2 */

      left_top_left_center: {name: 'left top left center', left: 10, top: 15},
      center_top_left_center: {name: 'center top left center', left: 5, top: 15},
      right_top_left_center: {name: 'right top left center', left: 0, top: 15},

      left_center_left_center: {name: 'left center left center', left: 10, top: 10},
      center_center_left_center: {name: 'center center left center', left: 5, top: 10},
      right_center_left_center: {name: 'right center left center', left: 0, top: 10},

      left_bottom_left_center: {name: 'left bottom left center', left: 10, top: 5},
      center_bottom_left_center: {name: 'center bottom left center', left: 5, top: 5},
      right_bottom_left_center: {name: 'right bottom left center', left: 0, top: 5},

      left_top_center_center: {name: 'left top center center', left: 15, top: 15},
      center_top_center_center: {name: 'center top center center', left: 10, top: 15},
      right_top_center_center: {name: 'right top center center', left: 5, top: 15},

      left_center_center_center: {name: 'left center center center', left: 15, top: 10},
      center_center_center_center: {name: 'center center center center', left: 10, top: 10},
      right_center_center_center: {name: 'right center center center', left: 5, top: 10},

      left_bottom_center_center: {name: 'left bottom center center', left: 15, top: 5},
      center_bottom_center_center: {name: 'center bottom center center', left: 10, top: 5},
      right_bottom_center_center: {name: 'right bottom center center', left: 5, top: 5},

      left_top_right_center: {name: 'left top right center', left: 20, top: 15},
      center_top_right_center: {name: 'center top right center', left: 15, top: 15},
      right_top_right_center: {name: 'right top right center', left: 10, top: 15},

      left_center_right_center: {name: 'left center right center', left: 20, top: 10},
      center_center_right_center: {name: 'center center right center', left: 15, top: 10},
      right_center_right_center: {name: 'right center right center', left: 10, top: 10},

      left_bottom_right_center: {name: 'left bottom right center', left: 20, top: 5},
      center_bottom_right_center: {name: 'center bottom right center', left: 15, top: 5},
      right_bottom_right_center: {name: 'right bottom right center', left: 10, top: 5},

      /* Stack 3 */

      left_top_left_bottom: {name: 'left top left bottom', left: 10, top: 20},
      center_top_left_bottom: {name: 'center top left bottom', left: 5, top: 20},
      right_top_left_bottom: {name: 'right top left bottom', left: 0, top: 20},

      left_center_left_bottom: {name: 'left center left bottom', left: 10, top: 15},
      center_center_left_bottom: {name: 'center center left bottom', left: 5, top: 15},
      right_center_left_bottom: {name: 'right center left bottom', left: 0, top: 15},

      left_bottom_left_bottom: {name: 'left bottom left bottom', left: 10, top: 10},
      center_bottom_left_bottom: {name: 'center bottom left bottom', left: 5, top: 10},
      right_bottom_left_bottom: {name: 'right bottom left bottom', left: 0, top: 10},

      left_top_center_bottom: {name: 'left top center bottom', left: 15, top: 20},
      center_top_center_bottom: {name: 'center top center bottom', left: 10, top: 20},
      right_top_center_bottom: {name: 'right top center bottom', left: 5, top: 20},

      left_center_center_bottom: {name: 'left center center bottom', left: 15, top: 15},
      center_center_center_bottom: {name: 'center center center bottom', left: 10, top: 15},
      right_center_center_bottom: {name: 'right center center bottom', left: 5, top: 15},

      left_bottom_center_bottom: {name: 'left bottom center bottom', left: 15, top: 10},
      center_bottom_center_bottom: {name: 'center bottom center bottom', left: 10, top: 10},
      right_bottom_center_bottom: {name: 'right bottom center bottom', left: 5, top: 10},

      left_top_right_bottom: {name: 'left top right bottom', left: 20, top: 20},
      center_top_right_bottom: {name: 'center top right bottom', left: 15, top: 20},
      right_top_right_bottom: {name: 'right top right bottom', left: 10, top: 20},

      left_center_right_bottom: {name: 'left center right bottom', left: 20, top: 15},
      center_center_right_bottom: {name: 'center center right bottom', left: 15, top: 15},
      right_center_right_bottom: {name: 'right center right bottom', left: 10, top: 15},

      left_bottom_right_bottom: {name: 'left bottom right bottom', left: 20, top: 10},
      center_bottom_right_bottom: {name: 'center bottom right bottom', left: 15, top: 10},
      right_bottom_right_bottom: {name: 'right bottom right bottom', left: 10, top: 10}

    },
    positionsLength = getObjectLength(positions);

//
// FUNCTIONS
//

function resetInlineStyles() {
  $wrapper.attr('style', '');
  $target.attr('style', '');
  $base.attr('style', '');
  $container.attr('style', '');
}
function getObjectLength(obj) {
  var count = 0, property;
  for (property in obj) { count++; }
  return count;
}

//
// TESTS
//

test('Set method - default positions', ltIE8 ? positionsLength : positionsLength * 2, function() {

  for (i = 0; i < positionStyles.length; i++) {

    target.style.position = positionStyles[i];

    for (prop in positions) {

      expected = {
        left: positions[prop].left,
        top: positions[prop].top
      };

      window.popo.set(target, {
        position: positions[prop].name,
        base: base
      });

      result = {
        left: parseFloat(target.style.left),
        top: parseFloat(target.style.top)
      };

      deepEqual(result, expected, 'Target CSS position = "' + positionStyles[i] + '", Target Popo position = "' + positions[prop].name + '"');

    }

  }

});

test('Get method - default positions', ltIE8 ? positionsLength * 1 : positionsLength * 2, function() {

  for (i = 0; i < positionStyles.length; i++) {

    target.style.position = positionStyles[i];

    for (prop in positions) {

      expected = {
        left: positions[prop].left,
        top: positions[prop].top
      };

      result = window.popo.get(target, {
        position: positions[prop].name,
        base: base
      });

      deepEqual(result, expected, 'Target CSS position = "' + positionStyles[i] + '", Target Popo position = "' + positions[prop].name + '"');

    }

  }

});

test('Offsets', 7, function() {

  resetInlineStyles();

  // Assertion #1

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '5'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 5,
    top: positions.center_center_center_center.top + 5
  };

  deepEqual(result, expected, '5');

  // Assertion #2

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '5 -5'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 5,
    top: positions.center_center_center_center.top - 5
  };

  deepEqual(result, expected, '5 -5');

  // Assertion #3

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '-19, 90deg 2'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left - 19,
    top: positions.center_center_center_center.top - 17
  };

  deepEqual(result, expected, '-19, 90deg 2');

  // Assertion #4

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '-19 97, 0deg 99'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 80,
    top: positions.center_center_center_center.top + 97
  };

  deepEqual(result, expected, '-19 97, 0deg 99');

  // Assertion #5

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '-19 97, 90deg 99'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left - 19,
    top: positions.center_center_center_center.top + 196
  };

  deepEqual(result, expected, '-19 97, 90deg 99');

  // Assertion #6

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '-19 97, 180deg 99'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left - 118,
    top: positions.center_center_center_center.top + 97
  };

  deepEqual(result, expected, '-19 97, 180deg 99');

  // Assertion #7

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    offset: '-19 97, 270deg 99'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left - 19,
    top: positions.center_center_center_center.top - 2
  };

  deepEqual(result, expected, '-19 97, 270deg 99');

});

test('onCollision callback', 2, function() {

  resetInlineStyles();

  // onCollision arguments

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: function (targetPosition, targetOverlap, posData) {
      result = [targetPosition, posData.target.element, posData.base.element, posData.container.element];
    }
  });

  expected = [{left: positions.center_center_center_center.left, top: positions.center_center_center_center.top}, target, base, container];

  deepEqual(result, expected, 'Callback receives correct arguments.');

  // onCollision target position

  temp = window.popo.get(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: function (targetPosition, targetOverlap, posData) {
      expected = [targetPosition.left - 1000, targetPosition.top + 1000];
    }
  });

  result = [temp.left - 1000, temp.top + 1000];

  deepEqual(result, expected, "Callback's first argument is the same object that is used to set the final position or return the final values.");

});

test('onCollision methods', 7, function() {

  resetInlineStyles();

  // "none"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'none'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left,
    top: positions.center_center_center_center.top
  };

  deepEqual(result, expected, 'none');

  // "push"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'push'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 10 - 3,
    top: positions.center_center_center_center.top + 10 - 3
  };

  deepEqual(result, expected, 'push');

  // "push none"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'push none'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 10 - 3,
    top: positions.center_center_center_center.top
  };

  deepEqual(result, expected, 'push none');

  // "push none push"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'push none push'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 10 - 3,
    top: positions.center_center_center_center.top
  };

  deepEqual(result, expected, 'push none push');

  // "push push none none"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'push push none none'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 10,
    top: positions.center_center_center_center.top + 10
  };

  deepEqual(result, expected, 'push push none none');

  // "push push push! push!"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'push push push! push!'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 4,
    top: positions.center_center_center_center.top + 4
  };

  deepEqual(result, expected, 'push push push! push!');

  // "push! push! push! push!"

  window.popo.set(target, {
    position: positions.center_center_center_center.name,
    base: base,
    container: container,
    onCollision: 'push! push! push! push!'
  });

  result = {
    left: parseFloat(target.style.left),
    top: parseFloat(target.style.top)
  };

  expected = {
    left: positions.center_center_center_center.left + 10,
    top: positions.center_center_center_center.top + 10
  };

  deepEqual(result, expected, 'push! push! push! push!');

});

test('Trimming whitespace from options', 1, function() {

  resetInlineStyles();

  result = window.popo.get(target, {
    position: ' ' + ' ' + ' ' + ' ' + ' ' + positions.center_center_center_center.name + ' ' + ' ' + ' ' + ' ' + ' ',
    offset: '                0 0 ',
    base: base
  });

  expected = {
    left: positions.center_center_center_center.left,
    top: positions.center_center_center_center.top
  };

  deepEqual(result, expected, 'Whitespace is trimmed correctly from options');

});

test('Coordinates', 1, function() {

  resetInlineStyles();

  // Assertion 1

  result = window.popo.get(target, {
    position: 'left top left top',
    base: [5, -5, base]
  });

  expected = {
    left: $base.offset().left + 5,
    top: $base.offset().top - 5
  };

  deepEqual(result, expected, 'Coordinates work as expected when base option is given an array with coordinates and a DOM element.');

});