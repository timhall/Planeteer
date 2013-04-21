cosmic.paths = (function (_, Kinetic, utils) {

    var paths = {};
    paths.objects = [];
    
    var pathContainer = new Kinetic.Group({
        x: 0,
        y: 0,
        opacity: 1,
        init: false
    })
    
    var pathList = [];
    
    var pathUpdate = function () {
        pathContainer.setX((0 - cosmic.camera.position.x)*cosmic.camera.scale);
        pathContainer.setY((0 - cosmic.camera.position.y)*cosmic.camera.scale);
        pathContainer.setScale(1 * cosmic.camera.scale, 1 * cosmic.camera.scale);
        
        if (pathContainer.attrs.init == false) {
            _.each(cosmic.environment.objects, function (obj) {
                if (obj.pathRun) {
                    pathList.push({path: obj.options.path, time: obj.options.pathTime, interval: obj.options.pathShow});
                }
            })
            //console.log(pathList);
            
            _.each(pathList, function (obj) {
                pathContainer.add(new Kinetic.Spline({
                    points: obj.path,
                    stroke: '#00BFFF',
                    strokeWidth: 3,
                    opacity: 1,
                    tension: 1
                }));
            })
            pathContainer.attrs.init = true;
        }
        //console.log(_.find(cosmic.environment.objects, function (obj) {return obj.options.type == 'Ship'}).options.path[0], pathList[0].path[0]);
        
        
        
        if (_.find(cosmic.environment.objects, function (obj) {return obj.options.type == 'Ship'}).options.path != pathList[0]) {
            pathList.length = 0;
            pathContainer.children.length = 0;
            
            _.each(cosmic.environment.objects, function (obj) {
                if (obj.pathRun) {
                    pathList.push({path: obj.options.path, time: obj.options.pathTime, interval: obj.options.pathShow});
                }
            })
            
            _.each(pathList, function (obj) {
                pathContainer.add(new Kinetic.Spline({
                    points: obj.path,
                    stroke: '#00BFFF',
                    strokeWidth: 3,
                    opacity: 1,
                    tension: 1
                }));
            })
        }
        
        _.each(pathContainer.children, function(obj) {
            obj.attrs.points.length = pathList[obj.index].interval/100;
            var t = obj.getPoints()[0].t;
            //console.log(t);
            /*while (t <= cosmic.time) {
                obj.setPoints(
                    function () {
                        obj.attrs.points.splice(0,1);
                        //obj.attrs.points.push(_.find(pathList[obj.index].path, function (obj2) {return obj2 == obj.getPoints()[48]}.index + 1))
                    }
                )
            }*/
        })
        
        
    }
    
    paths.objects.push({ display: pathContainer, draw: pathUpdate});
    
    
    
    return paths;
})(_, Kinetic, freebody.utils);