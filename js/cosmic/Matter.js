/**
 * Matter in the universe with physics and display
 */

define(
['freebody/Body', 'underscore'],
function (Body, _) {
    
    var Matter = function (options) {
        var matter = this;
        
        // Inherit instance properties from Body
        // (Call Body constructor, using matter as "this" and passing in options)
        Body.call(matter, options);
        
        // Create display object
        if (_.isFunction(matter.create)) {
            matter.create.call(matter);            
        }
        
        return matter;
    };
    
    // Inherit prototype properties from Body
    _.extend(Matter.prototype, Body.prototype);
    
    
    
    return Matter;
});