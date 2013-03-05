$(function(){

  var $target = $('#target'),
      $overlap = $('#overlap'),
      $handle = $('#drag-handle'),
      $container = $('#container'),
      dragCoords = {x: 0, y: 0};

  //
  // Functions
  //

  function getStyle(el, prop) {

    return el.currentStyle ? (
      el.currentStyle[prop]
    ) : document.defaultView && document.defaultView.getComputedStyle ? (
      document.defaultView.getComputedStyle(el, null).getPropertyValue(prop)
    ) : (
      null
    );

  }

  function checkOverlap() {

    popo.get($target[0], {
      base: $target[0],
      position: 'left top left top',
      container: $container[0],
      onCollision: function (targetPosition, targetOverlap, positionData) {

        // Update inner target's position
        $overlap.css({
          left: targetOverlap.left < 0 ? Math.abs(targetOverlap.left) : 0,
          right: targetOverlap.right < 0 ? Math.abs(targetOverlap.right) : 0,
          top: targetOverlap.top < 0 ? Math.abs(targetOverlap.top) : 0,
          bottom: targetOverlap.bottom < 0 ? Math.abs(targetOverlap.bottom) : 0
        });

        // If box is fully within container
        if (targetOverlap.left >= 0 && targetOverlap.right >= 0 && targetOverlap.top >= 0 && targetOverlap.bottom >= 0) {
          $container.removeClass('partial').addClass('full');

        // If box is fully outside container
        } else if (
          (targetOverlap.left < 0 && Math.abs(targetOverlap.left) >= positionData.target.width) || 
          (targetOverlap.right < 0 && Math.abs(targetOverlap.right) >= positionData.target.width) || 
          (targetOverlap.top < 0 && Math.abs(targetOverlap.top) >= positionData.target.height) || 
          (targetOverlap.bottom < 0 && Math.abs(targetOverlap.bottom) >= positionData.target.height)
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
  Hammer($target[0], {drag_max_touches: 0, drag_min_distance: 1}).on('touch dragstart drag dragend', function (ev) {

    ev.gesture.preventDefault();

    // Get the touch event
    var touch = ev.gesture.touches[0];

    // Hide/show drag handle
    if (ev.type === 'dragstart') {
      $handle[0].style.display = 'block';
    } else if (ev.type === 'dragend') {
      $handle[0].style.display = 'none';
    }

    // Position target element with Popo
    popo.set($target[0], {
      base: $target[0],
      position: 'left top left top',
      container: $target[0],
      onCollision: function (targetPosition, targetOverlap, data) {
        if (ev.type !== 'touch') {
          targetPosition.left = targetPosition.left + (touch.pageX < dragCoords.x ? -Math.abs(dragCoords.x - touch.pageX) : Math.abs(dragCoords.x - touch.pageX));
          targetPosition.top = targetPosition.top + (touch.pageY < dragCoords.y ? -Math.abs(dragCoords.y - touch.pageY) : Math.abs(dragCoords.y - touch.pageY));
        }
      }
    });

    // Update the coordinates
    dragCoords.x = touch.pageX;
    dragCoords.y = touch.pageY; 

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
  popo.set($target[0], {
    base: $container[0],
    position: 'center center center center'
  });

  // The initial overlap check
  checkOverlap();

});