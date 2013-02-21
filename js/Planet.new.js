define(
['cosmic', 'underscore', 'kinetic', 'art'],
function (cosmic, _, Kinetic, art) {
    var Planet = cosmic.gamePiece()
        .defaults({
            color: 'blue',
            mass: 10,
            x: 150,
            y: 150,
            radius: 25,
            preScale: 1,
            image: 'orange',
            clickOffset: {x: 0, y: 0},
            type: 'Planet'
        })
        .methods({
            draw: function (offset, zoom) {
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                
                //console.log(this.x, offset.x, zoom, this.options.preScale);
                this.display.setScale(this.options.preScale * zoom, this.options.preScale * zoom);
            },
            
            collide: function (obj) {
                //this.display.setFill('red');
            },
            
            sayHowdy: function () {
                console.log('Howdy!');
            }
        })
        .display(function () {
            var planet = this;
            var lastMousePos = {x:0,y:0}
            var display = new Kinetic.Group();
            
            
            // Create display
            if (this.options.image == 'orange') {
                this.options.preScale =
                    art.orange(display, this.options.radius, this.options.preScale).preScale;
            } else if (this.options.image == 'blue') {
                this.options.preScale =
                    art.blue(display, this.options.radius, this.options.preScale).preScale;
            }
            
            // Attach events
            var mouseIsDown = false;
            display.on('mousedown' || 'touchstart', function (e) {
                mouseIsDown = true;
                console.log(mouseIsDown);
                planet.options.clickOffset.x = e.layerX - (planet.x * cosmic.camera.scale);
                planet.options.clickOffset.y = e.layerY - (planet.y * cosmic.camera.scale);
                cosmic.selected = planet;
                console.log(cosmic.selected);
            });
            display.on('mousemove' || 'touchmove', function (e) {
                if (mouseIsDown) {
                    cosmic.envPause();
                    planet.x = (e.layerX - planet.options.clickOffset.x)/cosmic.camera.scale;
                    planet.y = (e.layerY - planet.options.clickOffset.y)/cosmic.camera.scale;
                    lastMousePos.x = e.layerX;
                    lastMousePos.y = e.layerY;
                    console.log(lastMousePos);
                }
            });
            display.on('mouseup' || 'touchend', function (e) {
                mouseIsDown = false;
                cosmic.start();
            })
            display.on('beforeDraw', function (e) {
                console.log(mouseIsDown);
                if (mouseIsDown == true) {
                    planet.x = lastMousePos.x - planet.options.clickOffset.x;
                    planet.y = lastMousePos.y - planet.options.clickOffset.y;
                }
            })
            
            return display;            
        })
        .events({
            'howdy': 'sayHowdy'
        })
        .collisions('centerDistance', function (bounding) {
            bounding(this, this.options.radius);
        })
        .construct();
    
    return Planet;
});
