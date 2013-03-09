$(function(){

  /*===========
    Variables
  ============*/

  var result, expected, prop, i, temp, positionsLength,
      
      // Check if the browser is IE7 or lower
      ltIE8 = $('html').hasClass('lt-ie8'),

      // Define allowed CSS position properties
      positionStyles = ltIE8 ? ['absolute'] : ['absolute', 'fixed'],

      // Get test elements
      $wrapper = $('#test-wrapper'),
      $target = $('#test-target'),
      $base = $('#test-base'),
      $container = $('#test-container'),

      // Define all positions and their expected values
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

      };

  /*===========
    Functions
  ============*/

  /**
  * Reset all inline styles of all elements, but keep target's
  * inline position property untouched. This function should
  * be called before each assertion just to in case.
  */
  function resetInlineStyles() {

    var targetPosition = $target[0].style.position;
    $wrapper.attr('style', '');
    $target.attr('style', '');
    $base.attr('style', '');
    $container.attr('style', '');
    $target[0].style.position = targetPosition;

  }

  /**
  * Calculating an object's length
  */
  function getObjectLength(obj) {

    var count = 0, property;
    for (property in obj) { count++; }
    return count;

  }

  /**
  * Default positioning tests
  */
  function positioningTests() {

    test('Positions (target: ' + $target[0].style.position + ')', positionsLength, function() {

      resetInlineStyles();

      for (prop in positions) {

        expected = {
          left: positions[prop].left,
          top: positions[prop].top
        };

        result = window.popo.get($target[0], {
          position: positions[prop].name,
          base: $base[0]
        });

        deepEqual(result, expected, positions[prop].name);

      }

    });

  }

  /**
  * General purpose tests
  */
  function generalTests() {

    test('Offsets', 7, function() {

      // Assertion #1

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '5'
      });

      expected = {
        left: positions.center_center_center_center.left + 5,
        top: positions.center_center_center_center.top + 5
      };

      deepEqual(result, expected, '5');

      // Assertion #2

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '5 -5'
      });

      expected = {
        left: positions.center_center_center_center.left + 5,
        top: positions.center_center_center_center.top - 5
      };

      deepEqual(result, expected, '5 -5');

      // Assertion #3

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '-19, 90deg 2'
      });

      expected = {
        left: positions.center_center_center_center.left - 19,
        top: positions.center_center_center_center.top - 17
      };

      deepEqual(result, expected, '-19, 90deg 2');

      // Assertion #4

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '-19 97, 0deg 99'
      });

      expected = {
        left: positions.center_center_center_center.left + 80,
        top: positions.center_center_center_center.top + 97
      };

      deepEqual(result, expected, '-19 97, 0deg 99');

      // Assertion #5

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '-19 97, 90deg 99'
      });

      expected = {
        left: positions.center_center_center_center.left - 19,
        top: positions.center_center_center_center.top + 196
      };

      deepEqual(result, expected, '-19 97, 90deg 99');

      // Assertion #6

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '-19 97, 180deg 99'
      });

      expected = {
        left: positions.center_center_center_center.left - 118,
        top: positions.center_center_center_center.top + 97
      };

      deepEqual(result, expected, '-19 97, 180deg 99');

      // Assertion #7

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        offset: '-19 97, 270deg 99'
      });

      expected = {
        left: positions.center_center_center_center.left - 19,
        top: positions.center_center_center_center.top - 2
      };

      deepEqual(result, expected, '-19 97, 270deg 99');

    });

    test('onCollision - Callback', 2, function() {

      // Assertion #1

      resetInlineStyles();

      window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: function (targetPosition, targetOverlap, posData) {
          result = [targetPosition, posData.target.element, posData.base.element, posData.container.element];
        }
      });

      expected = [{left: positions.center_center_center_center.left, top: positions.center_center_center_center.top}, $target[0], $base[0], $container[0]];

      deepEqual(result, expected, 'onCollision callback function has correct parameters.');

      // Assertion #2

      resetInlineStyles();

      expected = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0]
      });
      expected.left -= 1000;
      expected.top -= 1000;

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: function (targetPosition, targetOverlap, posData) {
          targetPosition.left -= 1000;
          targetPosition.top -= 1000;
        }
      });

      deepEqual(result, expected, "Callback's first argument is the same object that is used to set the final position.");

    });

    test('onCollision - Push', 7, function() {

      // Assertion #1

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'none'
      });

      expected = {
        left: positions.center_center_center_center.left,
        top: positions.center_center_center_center.top
      };

      deepEqual(result, expected, 'none');

      // Assertion #2

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'push'
      });

      expected = {
        left: positions.center_center_center_center.left + 10 - 3,
        top: positions.center_center_center_center.top + 10 - 3
      };

      deepEqual(result, expected, 'push');

      // Assertion #3

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'push!'
      });

      expected = {
        left: positions.center_center_center_center.left + 10 - 3,
        top: positions.center_center_center_center.top + 10 - 3
      };

      deepEqual(result, expected, 'push!');

      // Assertion #4

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'push none'
      });

      expected = {
        left: positions.center_center_center_center.left + 10 - 3,
        top: positions.center_center_center_center.top
      };

      deepEqual(result, expected, 'push none');

      // Assertion #5

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'push none push'
      });

      expected = {
        left: positions.center_center_center_center.left + 10 - 3,
        top: positions.center_center_center_center.top
      };

      deepEqual(result, expected, 'push none push');

      // Assertion #6

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'push push none none'
      });

      expected = {
        left: positions.center_center_center_center.left + 10,
        top: positions.center_center_center_center.top + 10
      };

      deepEqual(result, expected, 'push push none none');

      // Assertion #7

      result = window.popo.get($target[0], {
        position: positions.center_center_center_center.name,
        base: $base[0],
        container: $container[0],
        onCollision: 'push push push! push!'
      });

      expected = {
        left: positions.center_center_center_center.left + 4,
        top: positions.center_center_center_center.top + 4
      };

      deepEqual(result, expected, 'push push push! push!');

    });

    test('Coordinates', 1, function() {

      resetInlineStyles();

      // Assertion #1

      result = window.popo.get($target[0], {
        position: 'left top left top',
        base: [5, -5, $base[0]]
      });

      expected = {
        left: $base.offset().left + 5,
        top: $base.offset().top - 5
      };

      deepEqual(result, expected, 'Coordinates work as expected when base option is given an array with coordinates and a DOM element.');

    });

    test('Trim', 1, function() {

      resetInlineStyles();

      result = window.popo.get($target[0], {
        position: ' ' + ' ' + ' ' + ' ' + ' ' + positions.center_center_center_center.name + ' ' + ' ' + ' ' + ' ' + ' ',
        offset: '                0 0 ',
        base: $base[0]
      });

      expected = {
        left: positions.center_center_center_center.left,
        top: positions.center_center_center_center.top
      };

      deepEqual(result, expected, 'Whitespace is trimmed correctly from options');

    });

  }

  /*============
    Initialize
  ============*/

  // Calculate the amount of positions
  positionsLength = getObjectLength(positions);

  // Loop the whole shabang on positioning tests through once per allowed CSS property
  for (i = 0; i < positionStyles.length; i++) {
    $target[0].style.position = positionStyles[i];
    positioningTests();
  }

  // Set target's position to absolute for the remainder of the tests
  $target[0].style.position = 'absolute';

  // Run the rest of the tests
  generalTests();

});