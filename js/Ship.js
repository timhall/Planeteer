define(
['cosmic', 'underscore', 'kinetic', 'art'],
function (cosmic, _, Kinetic, art) {

    var Ship = cosmic.gamePiece()
        .defaults({
            color: 'blue',
            mass: 10,
            x: 150,
            y: 150,
            radius: 15,
            preScale: 1,
            postScale: 1
        })
        .methods({
            draw: function (offset, zoom) {
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                
                this.display.setScale(this.preScale * zoom, this.preScale * zoom);
                this.display.setRotationDeg(this.v.angle() + 90);
                this.postScale = this.preScale * zoom, this.preScale * zoom;
            },
            
            collide: function (obj) {
                //this.display.setFill('red');
            },
            
            sayHowdy: function () {
                console.log('Howdy!');
            }
        })
        .display(function () {
            var groupFighter = new Kinetic.Group();
            art.fighter(groupFighter, this.options.radius, this.postScale);
            return groupFighter;
        })
        .events({
            'howdy': 'sayHowdy'
        })
        .collisions('centerDistance', function (bounding) {
            bounding(this, this.options.radius);
        })
        .construct();
    
    return Ship;
});
