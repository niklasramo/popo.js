$(function(){

  // Get elements
  var $target = $('#target'),
      $overlap = $('#overlap'),
      $handle = $('#drag-handle'),
      $container = $('#container');

  //
  // Functions
  //

  function checkOverlap() {

    window.popo.get($target[0], {
      base: $target[0],
      position: 'left top left top',
      container: $container[0],
      onCollision: function (targetPosition, positionData) {

        // Get container overlap data
        var overlap = positionData.target.overlap;

        // Update inner target's position
        $overlap.css({
          left: overlap.left < 0 ? Math.abs(overlap.left) : 0,
          right: overlap.right < 0 ? Math.abs(overlap.right) : 0,
          top: overlap.top < 0 ? Math.abs(overlap.top) : 0,
          bottom: overlap.bottom < 0 ? Math.abs(overlap.bottom) : 0
        });

        // If box is fully within container
        if (overlap.left >= 0 && overlap.right >= 0 && overlap.top >= 0 && overlap.bottom >= 0) {
          $container.removeClass('partial').addClass('full');

        // If box is fully outside container
        } else if (
          (overlap.left < 0 && Math.abs(overlap.left) >= positionData.target.width) || 
          (overlap.right < 0 && Math.abs(overlap.right) >= positionData.target.width) || 
          (overlap.top < 0 && Math.abs(overlap.top) >= positionData.target.height) || 
          (overlap.bottom < 0 && Math.abs(overlap.bottom) >= positionData.target.height)
          ) {
          $container.removeClass('full partial');

        // If box is partly within container
        } else {
          $container.removeClass('full').addClass('partial');
        }

      }
    });

  }

  //
  // Listeners
  //

  // Hammer drag with Popo's help
  $target.hammer({drag_max_touches:0}).on('touch dragstart drag dragend', function (ev) {

    ev.gesture.preventDefault();

    // Hide/show drag handle
    if (ev.type === 'dragstart') {
      $handle.show();
    } else if (ev.type === 'dragend') {
      $handle.hide();
    }

    // Get the touch event
    var touch = ev.gesture.touches[0];

    // Position target element with popo
    window.popo.set($(this)[0], {
      base: [touch.pageX, touch.pageY],
      position: 'center center center center'
    });

    // Check overlap
    checkOverlap();

  });

  // Check overlap on window resize
  $(window).on('resize', function () {
    checkOverlap();
  });

  //
  // Init
  //

  // Align $target to the center of $container
  window.popo.set($target[0], {
    base: $container[0],
    position: 'center center center center'
  });

  // The initial overlap check
  checkOverlap();

});