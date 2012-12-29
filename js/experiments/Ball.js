define(
['cosmic', 'freebody', 'fabric', 'underscore'],
function (cosmic, freebody, fabric, _) {
   
    // Create simple ball
    var Ball = function () {
        // Inherit from Matter
        cosmic.Matter.call(this, {
            mass: 10,
            //v: new freebody.Vector().x(10),
            x: 150,
            y: 150
        });
        
        return this;
    };
    _.extend(Ball.prototype, cosmic.Matter.prototype, {
        create: function () {
            //this.display = new fabric.Circle()
            //    .set('x', 100).set('y', 100).set('radius', 25).set('fill', 'blue');
            
            this.display = new fabric.Circle({
                left: 100,
                top: 100,
                fill: 'red',
                radius: 25,
                selectable: false
            });
            
            return this.display;
        },
        draw: function (offset, zoom) {
            this.display.left = this.x - offset.x;
            this.display.top = this.y - offset.y;
            this.display.radius = 25 * zoom;    //watch this hardcode
        }
    });
    
    return Ball;
    
});