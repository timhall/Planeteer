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
            image: 'orange'
        })
        .methods({
            draw: function (offset, zoom) {
                this.display.setX((this.x - offset.x)*zoom);
                this.display.setY((this.y - offset.y)*zoom);
                console.log(this.x, offset.x, zoom, this.options.preScale);
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
            if (this.options.image == 'orange') {
                var groupOrange = new Kinetic.Group();
                art.orange(groupOrange, this.options.radius, this.options.preScale);
                //console.log(groupOrange);
                return groupOrange;
            } else if (this.options.image == 'blue') {
                var groupBlue = new Kinetic.Group();
                art.blue(groupBlue, this.options.radius, this.options.preScale);
                //console.log(groupBlue);
                return groupBlue;
            }
            
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
