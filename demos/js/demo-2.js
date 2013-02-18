$(function(){

  // Get elements
  var $target = $('#target'),
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

        // Get container overflow data
        var overflow = positionData.container.overflow;

        // If box is fully within container
        if (overflow.left >= 0 && overflow.right >= 0 && overflow.top >= 0 && overflow.bottom >= 0) {
          $container.removeClass('partial').addClass('full');

        // If box is fully outside container
        } else if (
          (overflow.left < 0 && Math.abs(overflow.left) >= positionData.target.width) || 
          (overflow.right < 0 && Math.abs(overflow.right) >= positionData.target.width) || 
          (overflow.top < 0 && Math.abs(overflow.top) >= positionData.target.height) || 
          (overflow.bottom < 0 && Math.abs(overflow.bottom) >= positionData.target.height)
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

  // Check overlap while dragging the target element
  $target.draggable({
    drag: function(event, ui) {
      checkOverlap();
    },
    stop: function (event, ui) {
      checkOverlap();
    }
  });

  // Check overlap on window resize
  $(window).on('resize', function () {
    checkOverlap();
  });

  //
  // Init
  //

  checkOverlap();

});