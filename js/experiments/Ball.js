define(
['cosmic', 'underscore', 'kinetic'],
function (cosmic, _, Kinetic) {
   
    // Create simple ball
    var Ball = function (options) {
        this.options = _.defaults(options, Ball.defaults);
        
        // Inherit from Matter
        cosmic.Matter.call(this, this.options);
        
        // Setup bounding
        // Center distance:
        this.setBounding(this.options.radius);
        // Bounding box:
        // this.setBounding(this.options.radius * 2, this.options.radius * 2, this.options.radius, 0);
    };
    
    Ball.defaults = {
        color: 'blue',
        mass: 10,
        x: 150,
        y: 150,
        radius: 25
    };
    
    _.extend(Ball.prototype, 
        // Extend Matter prototype
        cosmic.Matter.prototype, 
        
        // Add collision detection
        cosmic.collisions.centerDistance, 
        //cosmic.collisions.boundingBox,
        
        /**
         * @prototype
         */    
        {
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
                
                this.v.x(-this.v.x());
                this.v.y(-this.v.y());
            }
        }
    );
    
    return Ball;
    
});