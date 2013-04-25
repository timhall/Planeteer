cosmic.background = (function (_, Kinetic) {

    var background = {};
    background.objects = [];
    
    var starNum = 200
    var starfield = new Kinetic.Group();
    
    starfield.add(new Kinetic.Rect({
        width: 1000,
        height: 750,
        opacity: 1,
        fill: '#000000',
        init: false
    }));
    
    var stars = [];
    for (var i = 0; i < starNum; i++) {
        var star = new Kinetic.Circle({
            radius: 1,
            fill: '#E4E4E4',
            opacity: (Math.random()+1)/2,
            x: Math.floor(Math.random()*1000),
            y: Math.floor(Math.random()*750)
        });
        
        star.originalOpacity = star.attrs.opacity;
        stars.push(star);
    }
    
    _.each(stars, function (star) {
        starfield.add(star);
    });
    var updateSpacing = 5;//Math.floor(Math.random()*20 + 1);
    var lastUpdate = 0;
    var twinkle = function () {
        if (!this.init) {
            //this.
        }
        
        if (lastUpdate++ >= updateSpacing) {
            lastUpdate = 0;
            //updateSpacing = Math.floor(Math.random()*10 + 10)
            //_.each(stars, function (star) {
            for (var i = 0; i < (stars.length/5); i++) {
                var target = stars[Math.floor(Math.random()*starNum)];
                var currentOpacity = target.attrs.opacity;
                
                target.setOpacity(target.originalOpacity * (1 - (Math.random() / 2 - 0.25)));
            }
            //});
        }
    };
    
    /*
    for (var i = 0; i < 150; i++) {
        starfield.add(new Kinetic.Circle({
            radius: 1,
            fill: '#E4E4E4',
            opacity: (Math.random()+1)/2,
            x: Math.floor(Math.random()*800),
            y: Math.floor(Math.random()*600)
        }))
    }
    */
    
    background.objects.push({ display: starfield, draw: twinkle });
    
    var boundary = new Kinetic.Rect({
        x:0,
        y:0,
        width: cosmic.environment.bounds.width,
        height: cosmic.environment.bounds.height,
        stroke: '#00BFFF',
        opacity: 0.5,
        strokeWidth: 6,
        dashArray: [25,15]
    })
    
    var moveBound = function () {
        boundary.setX((0 - cosmic.camera.position.x)*cosmic.camera.scale);
        boundary.setY((0 - cosmic.camera.position.y)*cosmic.camera.scale);
        
        if (cosmic.environment.bounds.width != boundary.getWidth()) {
            boundary.setWidth(cosmic.environment.bounds.width);
            boundary.setHeight(cosmic.environment.bounds.height);
        }
        //console.log(this.x, offset.x, zoom, this.options.preScale);
        boundary.setScale(1 * cosmic.camera.scale, 1 * cosmic.camera.scale);
    }
    
    background.objects.push({display: boundary, draw: moveBound});
    
    return background;
})(_, Kinetic);
