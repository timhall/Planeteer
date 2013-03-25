//define(
//['cosmic', 'underscore', 'kinetic', 'art', 'freebody/Vector', 'freebody/utils', 'cosmic/CameraBase'],
var Ship = (function (cosmic, _, Kinetic, art, Vector, utils, CameraBase) {

    var Ship = cosmic.gamePiece()
        .defaults({
            color: 'blue',
            mass: 10,
            x: 150,
            y: 150,
            radius: 15,
            preScale: 1,
            postScale: 1,
            spin: false,
            jet: null,
            jetting: 0,
            angle: null,
            spinCount: 0,
            type: 'Ship'
        })
        .methods({
            draw: function (offset, zoom) {
                
                while (this.display.getRotationDeg() > 360) {this.display.setRotationDeg(this.display.getRotationDeg() - 360);}
                this.options.angle = this.display.getRotationDeg();
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                
                
                this.display.setScale(this.options.preScale * zoom, this.options.preScale * zoom);
                this.postScale = this.options.preScale * zoom, this.options.preScale * zoom;
                
                
                if (this.options.spin == true) {
                    //console.log(Math.abs(this.display.getRotationDeg() - this.v.angle()));
                    if (Math.abs((this.options.angle - 90) - this.v.angle()) <= 10) {
                        this.options.spinCount += 1;
                        if (this.options.spinCount == 10) {
                            this.options.spin = false;
                            this.options.spinCount = 0;
                        } else {
                        this.display.setRotationDeg(this.v.angle() + 90 + 2*Math.sqrt(Math.abs(this.v.magnitude())));
                        }
                    } else {
                        this.display.setRotation(this.v.angle() + 90 + 2*Math.sqrt(Math.abs(this.v.magnitude())));
                    }
                } else {
                    this.display.setRotationDeg(this.v.angle() + 90);
                    if (this.options.spinCount != 0) {this.options.spinCount = 0;}
                }
                
                
                if (this.options.jet != null) {
                    console.log('jetting')
                    this.display.children[0].attrs.visible = true;
                    this.display.children[0].attrs.scale.y = Math.sqrt(this.options.jet)+1;
                    this.display.children[0].attrs.offset.y = -24/(Math.sqrt(this.options.jet)+1); //22.7?
                    this.thrust(this);
                    
                }
            },
            
            collide: function (obj) {
                if (obj.options.type != 'Destination') {
                    this.options.spin = !this.options.spin;
                }
                //console.log('SCREW YOU')
            },
            
            sayHowdy: function () {
                console.log('Howdy!');
            },
            thrust: function (body) {
                if (body.forces.length > 2) {
                    body.forces.pop();
                }
                var mag = body.options.jet * body.mass;
                
                var force = new Vector();
            
                var t = function() {
                    force.magnitude(mag);
                    force.angle(body.angle);
        
                    return force;
                };
                body.forces.push(t);
                body.options.jetting = body.options.jet;
                body.options.jet = null;
            }
            
        })
        .display(function () {
            var ship = this;
            var display = new Kinetic.Group();
            
            display.followClick = function (e) {
                console.log('first');
                cosmic.camera.follow(ship);
            }
            
            display.select = function (e) {
                cosmic.selected = ship;
            }
            
            this.options.preScale = 
                art.fighter(display, this.options.radius, this.options.preScale, this.options.color).preScale;
            return display;
            
        })
        .events({
            'howdy': 'sayHowdy'
        })
        .collisions('centerDistance', function (bounding) {
            bounding(this, this.options.radius);
        })
        .construct();
    
    return Ship;
})(cosmic, _, Kinetic, art, freebody.Vector, freebody.utils, cosmic.CameraBase);
