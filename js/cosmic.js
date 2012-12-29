define(
['cosmic/Matter', 'cosmic/environment', 'cosmic/ICamera'],
function (Matter, environment, ICamera) {
    var cosmic = {},
        time,
        rAF = window.requestAnimationFrame;
    
    // General classes
    cosmic.Matter = Matter;
    cosmic.ICamera = ICamera;
    
    cosmic.environment = environment;   
    
    cosmic.start = function () {
        // Init...
        cosmic.progress();
    };
    
    cosmic.progress = function (timestamp) {
        // Setup next progress
        rAF(cosmic.progress);
        
        // Update physics
        cosmic.environment.advance(timestamp - (time || timestamp));
        
        // Render updated objects
        if (cosmic.beforeRender) { cosmic.beforeRender(); }
        
        if (cosmic.camera) {
            cosmic.camera.render();
        }
        
        // Update time
        time = timestamp;
    }
    
    // Finally, return cosmic
    return cosmic;
});