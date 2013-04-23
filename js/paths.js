cosmic.paths = (function (_, Kinetic, utils) {

    var paths = {},
        tracked = [],
        group = new Kinetic.Group({
            x: 0,
            y: 0,
            opacity: 1
        }),
        path, camera;
        
    paths.objects = [
        {
            display: group
        }
    ];
    
    paths.track = function (obj) {
        if (obj && typeof obj.path === 'function') {
            var path = new Kinetic.Spline({
                stroke: '#00BFFF',
                strokeWidth: 3,
                opacity: 1,
                tension: 1
            })
            
            drawPath(obj, path);
            
            tracked.push({
                obj: obj,
                path: path
            });
            group.add(path);
        }
    };
    
    paths.place = function () {
        camera = cosmic.camera;
        group.setX((0 - camera.position.x) * camera.scale);
        group.setY((0 - camera.position.y) * camera.scale);
        group.setScale(1 * camera.scale, 1 * camera.scale);
    };
    
    paths.update = function () {
        paths.place();
        
        for (var i = 0, max = tracked.length; i < max; i += 1) {
            drawPath(tracked[i].obj, tracked[i].path);
        }  
    };
    
    paths.init = function () {
        paths.update();
    };
    
    cosmic.hub.on('playback:start', function () {
        paths.init();
    });
    cosmic.hub.on('camera:zoom camera:pan camera:follow camera:center', function () {
        paths.place(); 
    });
    cosmic.hub.on('planet:move', function () {
        paths.update();
    })
    
    var drawPath = function (obj, path) {
        path.setPoints(obj.path());
    }
    
    return paths;
    
})(_, Kinetic, freebody.utils);
