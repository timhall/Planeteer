/**
 * Matter in the universe with physics and display
 */

//define(
//['freebody', 'underscore', 'backbone'],
var cosmic = cosmic || {};
cosmic.Matter = (function (freebody, _, Backbone) {
    
    /**
     * Matter
     * 
     * @param {Object} [options]
     * @class
     */
    var Matter = function (options) {
        var matter = this;
        
        // Instance properties
        matter.angle = 0;
     
        // Inherit instance properties from Body
        // (Call Body constructor, using matter as "this" and passing in options)
        freebody.Body.call(matter, options);
        
        return matter;
    };
    
    /**
     * @prototype
     */
    _.extend(Matter.prototype, 
        // Inherit prototype properties from Body
        freebody.Body.prototype,
        
        // Add Events (from Backbone)
        Backbone.Events,
        
        {
            /**
             * Check for collision (and apply if found)
             *
             * @param {Matter} obj to check
             * @prototype
             */
            collision: function (obj) {
                var matter = this;
                
                // Check collision (if defined)
                if (_.isFunction(matter.checkCollision) && matter.checkCollision(obj)) {
                    matter.collide(obj);
                    obj.collide(matter);
                    
                    return true;
                }
                
                return false;
            },
            
            /**
             * Apply collision with object
             * 
             * @param {Matter} obj that was collided with
             * @prototype
             */
            collide: function (obj) {}
            
        }
    );
    
    return Matter;
})(freebody, _, Backbone);