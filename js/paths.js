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
                strokeWidth: 4,
                opacity: 0.7,
                tension: 0
            })
            
            drawPath(obj.path(60000), path);
            
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
        var buffer = 0,
            points, collided;
        
        paths.place();
        
        for (var i = 0, max = tracked.length; i < max; i += 1) {
            if (tracked[i].path.getStroke() != '#00BFFF') {
                tracked[i].path.setStroke('#00BFFF');
            }
        }
        
        //For each object that is being tracked,
        _.each(tracked, function (trackedObj) {    
            
            points = trackedObj.obj.path();
            trackedObj.points = points;
            
            //find the first point in its prediction
            _.find(points, function (point, index) {
                
                // that collides with an object in the environment, 
                // with a buffer of 20 (the radius of the ship)
                // while only looking for planets or destination
                collided = _.find(cosmic.environment.objects, function (envObj) {
                    if (envObj.options.type != 'Ship') {
                        return Math.abs(freebody.utils.distance(envObj, point)) < (envObj.options.radius + buffer);
                    } else {
                        return false;
                    }
                });
                                
                if (collided && collided.options.type == 'Ship') {
                    // Continue find
                    return false;
                } else if (collided && collided.options.type == 'Planet') {
                    console.log(point);
                    trackedObj.points = points.slice(0, index + 1);
                    trackedObj.path.setStroke('#B40404');
                    cosmic.ui.objects[1].display.attrs.stat = 'Incoming';
                    return true;
               } else if (collided && collided.options.type == 'Destination') {
                    console.log('Travel time: ' + point.t/1000);
                    trackedObj.points = points.slice(0, index + 1);
                    trackedObj.path.setStroke('green');
                    cosmic.hub.trigger('path:intersect:destination', point);
                    cosmic.ui.objects[1].display.attrs.stat = 'Winning';
                    return true;
               } else if (point.x < -buffer || point.x > cosmic.environment.bounds.width + buffer || point.y < -buffer || point.y > cosmic.environment.bounds.height + buffer) {
                    console.log(point);
                    trackedObj.points = points.slice(0, index + 1);
                    trackedObj.path.setStroke('#B40404');
                    cosmic.ui.objects[1].display.attrs.stat = 'Escaping';
                    return true;
               } else {
                    cosmic.ui.objects[1].display.attrs.stat = 'Normal';
               };
            })
        })
        
        for (var i = 0, max = tracked.length; i < max; i += 1) {
            drawPath(tracked[i].points, tracked[i].path);
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
    });
    cosmic.hub.on('destination:move', function () {
        paths.update();
    });
    cosmic.hub.on('collision', function () {
        //
    })
    
    var drawPath = function (points, spline) {
        if (points) {
            spline.setPoints(points);
        }
    }
    
    return paths;
    
})(_, Kinetic, freebody.utils);
