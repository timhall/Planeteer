define(
['cosmic', 'underscore', 'kinetic'],
function (cosmic, _, Kinetic) {
   
    /**
     * Create simple ball
     * @constructor
     */
    var Ball = function (options) {
        this.options = _.defaults(options, Ball.defaults);
        
        // Inherit from Matter
        cosmic.Matter.call(this, this.options);
        
        // Setup bounding
        cosmic.collisions.centerDistance.bounding(this, this.options.radius);
        // this.setBounding(this.options.radius);
    };
    
    /**
     * Default properties
     * @static
     */
    Ball.defaults = {
        color: 'blue',
        mass: 10,
        x: 150,
        y: 150,
        radius: 25
    };
    
    /**
     * @prototype
     */
    Ball.prototype = {
        create: function () {
            var options = this.options;
            
            this.display = new Kinetic.Circle({
                radius: options.radius || 25,
                fill: options.color || 'blue',
                stroke: 'black',
                strokeWidth: 4
            });
            
            return this.display;
        },
        draw: function (offset, zoom) {
            this.display.setX(this.x - offset.x);
            this.display.setY(this.y - offset.y);
            this.display.setScale(zoom, zoom);
        },
        collide: function () {
            this.display.setFill('red');
            
            // BUG: I think this was causing some conflict with collisions
            //this.v.x(-this.v.x());
            //this.v.y(-this.v.y());
        }
    };
    
    // Extensions
    _.extend(Ball.prototype,
        cosmic.Matter.prototype,
        cosmic.collisions.centerDistance.methods
    );
    
    // Finally, return
    return Ball;
    
});