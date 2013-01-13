define(
['cosmic', 'underscore', 'kinetic'],
function (cosmic, _, Kinetic) {

    var Planet = cosmic.gamePiece()
        .defaults({
            color: 'blue',
            mass: 10,
            x: 150,
            y: 150,
            radius: 25
        })
        .methods({
            draw: function (offset, zoom) {
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                
                this.display.setScale(zoom, zoom);
            },
            
            collide: function (obj) {
                this.display.setFill('red');
            },
            
            sayHowdy: function () {
                console.log('Howdy!');
            }
        })
        .display(function () {
            return new Kinetic.Circle({
                radius: this.options.radius,
                fill: this.options.color,
                stroke: 'black',
                strokeWidth: 2
            })
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
