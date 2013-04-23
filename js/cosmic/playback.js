cosmic.playback = (function (global, hub) {
    var rAF = global.requestAnimationFrame,
        paused = { progress: false, render: false, physics: false },
        running = false,
        requestId;
    
    var playback = {};

    playback.progress = function (timestamp) {
        if (!paused.progress) {
            // Setup next progress
            requestId = rAF(playback.progress);
        }

        if (!paused.physics) {
            // Update physics and then store time
            hub.trigger('playback:advance:before');
            cosmic.environment.advance(timestamp - (cosmic.time || timestamp));
            cosmic.time = timestamp;
            hub.trigger('playback:advance');
        }

        if (!paused.render && cosmic.camera !== undefined) {
            // Render
            hub.trigger('playback:render:before');
            cosmic.camera.render();
            hub.trigger('playback:render');
        }
    };

    playback.start = function (paused) {
        if (!paused) { playback.unpause(); }
        playback.progress();
        running = true;

        hub.trigger('playback:start');
    };

    playback.step = function (timestep) {
        paused.progress = true;

        if (cosmic.time === undefined) {
            cosmic.time = +new Date;
        }
        
        timestep = timestep !== undefined ? timestep : (1000 / 60)
        playback.progress(cosmic.time + timestep);

        hub.trigger('playback:step');
    }

    playback.pause = function (options) {
        if (options) {
            if (options.progress !== undefined) {
                paused.progress = options.progress;
            }
            if (options.render !== undefined) {
                paused.render = options.render;
            }
            if (options.physics !== undefined) {
                paused.physics = options.physics;
            } else {
                paused.physics = true;
            }
        } else {
            paused.physics = true;
        }

        hub.trigger('playback:pause');
    };

    playback.unpause = function (options) {
        if (options) {
            if (options.progress !== undefined) {
                paused.progress = options.progress;
            }
            if (options.render !== undefined) {
                paused.render = options.render;
            }
            if (options.physics !== undefined) {
                paused.physics = options.physics;
            } else {
                paused.physics = false;
            }
        } else {
            paused.physics = false;
        }
        
        cosmic.time = +new Date;

        hub.trigger('playback:unpause');
    };

    playback.stop = function () {
        // Cancel progress callback (if defined)
        if (requestId) {
            global.cancelAnimationFrame(requestId);
        }

        // Reset timestamp and reset running
        cosmic.time = undefined;
        running = false;

        hub.trigger('playback:stop');
    };

    return playback;

})(this || window, cosmic.hub);
