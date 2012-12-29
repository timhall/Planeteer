define(
['cosmic', 'freebody', 'underscore', 'kinetic'],
function (cosmic, freebody, _, Kinetic) {
   
    // Create simple ball
    var Ball = function (options) {
        options = _.extend({}, Ball.defaults, options);
        
        this.color = options.color;
        
        // Inherit from Matter
        cosmic.Matter.call(this, options);
        
        return this;
    };
    
    Ball.defaults = {
        color: 'blue',
        mass: 10,
        x: 150,
        y: 150
    }
    
    _.extend(Ball.prototype, cosmic.Matter.prototype, {
        create: function () {
            var color = this.color || 'blue';
            
            this.display = new Kinetic.Circle({
                radius: 25,
                fill: color,
                stroke: 'black',
                strokeWidth: 4
            });
            
            return this.display;
        },
        draw: function (offset, zoom) {
            this.display.setX(this.x - offset.x);
            this.display.setY(this.y - offset.y);
            this.display.setScale(zoom, zoom);
            
        }
    });
    
    return Ball;
    
});