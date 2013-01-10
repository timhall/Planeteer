/**
 * Hold matter and advance it through physics all together
 */
define(
['freebody', 'underscore'],
function (freebody, _) {

    var environment = {},
        gravityScale = 1.9;
        
    environment.objects = [];
    environment.planets = [];
    environment.bodies = [];
    
    environment.bounds = {
        width: 800,
        height: 600
    };
    
    environment.addBody = function (body) {
        this.addObject(body, 'body');
    };
    
    environment.addPlanet = function (planet) {
        this.addObject(planet, 'planet');
    };
    
    /**
     * Add object (of type) to environment
     * 
     * @param {Matter} object
     * @param {String} [type] type of object
     */
    environment.addObject = function (object, type) {
        environment.objects.push(object);
        
        if (type == 'planet') {
            // Add as planet and apply gravity from planet to all bodies
            environment.planets.push(object);
            _.each(environment.bodies, function (body){
                freebody.gravity.planetary(body, object, gravityScale);
            })
        } else if (type == 'body') {
            // Add as body and apply gravity from all planets to body
            environment.bodies.push(object);
            _.each(environment.planets, function (planet) {
                freebody.gravity.planetary(object, planet, gravityScale);
            })
        }
    }
    
    /**
     * Advance all objects in environment and check for collisions
     * 
     * @param {Number} timestep to advance by
     */
    environment.advance = function (timestep) {
        // Advance physics for objects by timestep
        _.each(environment.objects, function (obj) {
            if (_.isFunction(obj.advance)) {
                obj.advance(timestep);
            }
        });
        
        // Check for collisions
        _.each(environment.objects, function (obj, i) {
            if (_.isFunction(obj.collision)) {
                // Check for collision for remaining objects
                for (var j = i + 1; j < environment.objects.length; j += 1) {
                    obj.collision(environment.objects[j]);
                }
            }
        });
        
        // Check for out-of-bounds
        _.each(environment.objects, function (obj) {
            environment.outOfBounds(obj);
        });
    };
    
    /**
     * Check if object is out-of-bounds and handle
     * 
     * @param {Matter} obj
     * @return {Boolean} isOutOfBounds
     */
    environment.outOfBounds = function (obj) {
        if (obj.x < -10) {
            obj.x = environment.bounds.width + 10;
        } else if (obj.x > environment.bounds.width + 10) {
            obj.x = -10;
        }
        
        if (obj.y < -10) {
            obj.y = environment.bounds.height + 10;
        } else if (obj.y > environment.bounds.height + 10) {
            obj.y = -10;
        }
    };
    
    return environment;
});
