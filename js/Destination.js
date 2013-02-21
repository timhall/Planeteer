define(
['cosmic', 'underscore', 'kinetic', 'art'],
function (cosmic, _, Kinetic, art) {
    var Destination = cosmic.gamePiece()
        .defaults({
            color: null,
            x: 150,
            y: 150,
            radius: 25,
            preScale: 1,
            clickOffset: {x: 0, y: 0},
            type: 'Destination',
            _resetting: false
        })
        .methods({
            draw: function (offset, zoom) {
                this.display.children[0].setFill(this.options.color);
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                    
                this.display.setScale(this.options.preScale * zoom, this.options.preScale * zoom);   
            },
            collide: function (obj) {
                    this.display.children[0].setFill('#F78181');
                    console.log('destination colliding', cosmic.time)
                    if (this.options._resetting == false) {
                        cosmic.envPause();
                    }
            }
        })
        
        .display(function() {
            var destination = this;
            var lastMousePos = {x:0,y:0}
            var display = new Kinetic.Group();
            
            this.options.preScale = 
                art.destination(display, this.options.radius, this.options.preScale, this.options.color).preScale;
            this.options.color = 
                art.destination(display, this.options.radius, this.options.preScale, this.options.color).color;
            
            // Attach events
            var mouseIsDown = false;
            display.on('mousedown' || 'touchstart', function (e) {
                mouseIsDown = true;
                console.log(mouseIsDown);
                destination.options.clickOffset.x = e.layerX - (destination.x * cosmic.camera.scale);
                destination.options.clickOffset.y = e.layerY - (destination.y * cosmic.camera.scale);
                
                cosmic.selected = destination;
                console.log(cosmic.selected);
            });
            display.on('mousemove' || 'touchmove', function (e) {
                if (mouseIsDown) {
                    cosmic.envPause();
                    destination.x = (e.layerX - destination.options.clickOffset.x)/cosmic.camera.scale;
                    destination.y = (e.layerY - destination.options.clickOffset.y)/cosmic.camera.scale;
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
                    destination.x = lastMousePos.x - destination.options.clickOffset.x;
                    destination.y = lastMousePos.y - destination.options.clickOffset.y;
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
        .construct()

    return Destination;
})