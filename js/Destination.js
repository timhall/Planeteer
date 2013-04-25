//define(
//['cosmic', 'underscore', 'kinetic', 'art'],
var Destination = (function (cosmic, _, Kinetic, art) {
    var Destination = cosmic.gamePiece()
        .defaults({
            color: null,
            x: 150,
            y: 150,
            radius: 25,
            preScale: 1,
            type: 'Destination',
            _resetting: false,
            _destTime: null
        })
        .methods({
            draw: function (offset, zoom) {
                this.display.children[0].setFill(this.options.color);
                //console.log(this.display.children[1].getRotation());
                this.display.children[1].setRotation(this.display.children[1].attrs.rotation + 0.015);
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                    
                this.display.setScale(this.options.preScale * zoom, this.options.preScale * zoom);
                if (this.options._destTime && cosmic.time - this.options._destTime > 800) {
                    cosmic.reset();
                    this.options._destTime = null;
                    cosmic.unpause();
                }
            },
            collide: function (obj) {
                    this.display.children[0].setFill('#F78181');
                    console.log('destination colliding', this._resetting);
                    if (this.options._resetting == false) {
                        //this.options._destTime = cosmic.time;
                        cosmic.playback.pause();
                        console.log(this.options.destTime, cosmic.time);
                    }
            },
            drag: function (e) {
                if (e && cosmic.camera) {
                    this.x = (e.layerX)/cosmic.camera.scale + cosmic.camera.position.x;
                    this.y = (e.layerY)/cosmic.camera.scale + cosmic.camera.position.y;    
                    cosmic.hub.trigger('destination:move', this);
                }
            }
        })
        
        .display(function() {
            var display = new Kinetic.Group();

            this.options.preScale = 
                art.destination(display, this.options.radius, this.options.preScale, this.options.color).preScale;
            this.options.color = 
                art.destination(display, this.options.radius, this.options.preScale, this.options.color).color;
            
            // Attach events
            /*
            display.move = function (e) {
                destination.x = (e.layerX)/cosmic.camera.scale + cosmic.camera.position.x;
                destination.y = (e.layerY)/cosmic.camera.scale + cosmic.camera.position.y;
            };
            
            display.followClick = function(e) {
                cosmic.camera.follow(destination);
            }
            
            display.select = function (e) {
                cosmic.selected = destination;
            }
            */
            
            return display;
        })
            
        
        .events({
            'touchmove': 'drag'
        })
        .collisions('centerDistance', function (bounding) {
            bounding(this, this.options.radius);
        })
        .construct()

    return Destination;
})(cosmic, _, Kinetic, art);