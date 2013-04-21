var rAF = window.requestAnimationFrame,
    _paused = false,
    _pausedPhysics = false,
    initStart = false,
    selected = {};

cosmic.start = function () {
    cosmic.unpause();
    cosmic.progress();
};
cosmic.startRendering = function () {
    cosmic.unpause();
    cosmic.pausePhysics();
    cosmic.progress();
};

cosmic.progress = function (timestamp) {
    if (!_paused) {    
        // Setup next progress
        rAF(cosmic.progress);
              
        if (!_pausedPhysics) {
            //console.log(_paused)
            // Update physics
            cosmic.environment.advance(timestamp - (cosmic.time || timestamp));
        }
              
        // Update time
        cosmic.time = timestamp;
              
        // Render updated objects
        if (cosmic.beforeRender) { cosmic.beforeRender(); }
              
        if (cosmic.camera) {      
            cosmic.camera.render();
        }
    }
};
    
cosmic.reset = function () {
    _.each(cosmic.environment.objects, function (object) {
        object.x = Math.floor(Math.random()*1400 + 100);
        object.y = Math.floor(Math.random()*1200 + 100);
        cosmic.camera.reset();
        cosmic.iteration += 1;
        console.log(cosmic.iteration);
    })
}
  
cosmic.pause = function () {
    _paused = true;
};
cosmic.pausePhysics = function () {
    _pausedPhysics = true;
};
cosmic.unpause = function () {
    _paused = false;
    _pausedPhysics = false;
       
    //somewhat janky logic
    //mousedown forces pause and mouseup forces unpause
    //so it can be assumed that every player action is associated with an unpause
    //therefore it refreshes on each unpause
       
    _.each(environment.objects, function (obj) {
        if (obj.pathRun) {obj.pathRun(10000, 100, cosmic.time);}
    });
}
  
cosmic.step = function () {
    cosmic.start();
    cosmic.pause();
};
