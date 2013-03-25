//define(
//['cosmic', 'underscore', 'kinetic', 'art'],
var Planet = (function (cosmic, _, Kinetic, art) {
    var Planet = cosmic.gamePiece()
        .defaults({
            color: 'blue',
            mass: 10,
            x: 150,
            y: 150,
            radius: 25,
            preScale: 1,
            image: 'orange',
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
            display.move = function (e) {
                planet.x = (e.layerX)/cosmic.camera.scale + cosmic.camera.position.x;
                planet.y = (e.layerY)/cosmic.camera.scale + cosmic.camera.position.y;
            };
            
            display.followClick = function (e) {
                cosmic.camera.follow(planet);
                console.log('called follow', planet)
            }
            
            display.select = function (e) {
                cosmic.selected = planet;
            }
            
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
})(cosmic, _, Kinetic, art);
