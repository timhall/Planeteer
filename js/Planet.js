define(
['cosmic', 'underscore', 'kinetic'],
function (cosmic, _, Kinetic) {

    /**
     * Planet class
     */
    var Planet = function (options) {
        // Set options and inherit from Matter
        this.options = _.defaults(options, Planet.defaults);
        cosmic.Matter.call(this, this.options);
        
        // Properties
        // ...
        
        // Define display
        /*this.display = new Kinetic.Circle({
            radius: this.options.radius,
            fill: this.options.color,
            stroke: 'black',
            strokeWidth: 2
        });*/
        
        
        // Setup bounding (center distance)
        cosmic.collisions.centerDistance.bounding(this, this.options.radius);
    };    
    
    /**
     * Default properties
     * @static
     */
    Planet.defaults = {
        color: 'blue',
        mass: 10,
        x: 150,
        y: 150,
        radius: 25
    };
 
    /**
     * @prototype
     */
    Planet.prototype = {
        draw: function (offset, zoom) {
            this.display.setX((this.x - offset.x)*zoom);
            this.display.setY((this.y - offset.y)*zoom);
                
            this.display.setScale(zoom, zoom);
        },
            
        collide: function (obj) {
            this.display.setFill('red');
        }
    };

    // Extensions
    _.extend(Planet.prototype,
        cosmic.Matter.prototype,
        cosmic.collisions.centerDistance.methods
    );
    
    return Planet;
});
/*
var Planet = gamePiece()
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
    .collisions('centerDistance', function (bounding) {
        bounding(this.options.radius);
    })
    .construct();
*/