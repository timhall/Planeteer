define(
['cosmic/Matter', 'cosmic/environment', 'cosmic/CameraBase', 'cosmic/collisions', 'cosmic/gamePiece', 'cosmic/KineticCamera'],
function (Matter, environment, CameraBase, collisions, gamePiece, KineticCamera) {
  var cosmic = {},
      rAF = window.requestAnimationFrame,
      _paused = 'false',
      initStart = false,
      selected = {};
  
  // General classes
  cosmic.Matter = Matter;
  cosmic.CameraBase = CameraBase;
  cosmic.collisions = collisions;
  cosmic.gamePiece = gamePiece;
  cosmic.environment = environment;
  cosmic.ui = {objects:[]};
  

  cosmic.start = function () {
      // Init...
      if (cosmic.initStart) {
          _paused = 'false';
      }
      cosmic.progress();
  };
  
  cosmic.progress = function (timestamp) {
      if (_paused != 'all') {
          // Setup next progress
          rAF(cosmic.progress);
          
          if (_paused != 'env') {
              //console.log(_paused)
              // Update physics
              cosmic.environment.advance(timestamp - (time || timestamp));
          }
          
          // Update time
          time = timestamp;
          
          // Render updated objects
          if (cosmic.beforeRender) { cosmic.beforeRender(); }
          
          if (cosmic.camera) {
              cosmic.camera.render();
          }
      }
  };
  
  cosmic.allPause = function () {
      _paused = 'all';
  };
  
  cosmic.envPause = function () {
      _paused = 'env'
  };
  
  cosmic.step = function () {
      cosmic.start();
      cosmic.pause();
  }
  
  // Finally, return cosmic
  return cosmic;
});