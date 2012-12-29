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
        for (var i = 0; i < environment.objects.length; i++) {
            if (_.isFunction(environment.objects[i].advance)){
                environment.objects[i].advance(timestep);
            }
        }
        
        // TODO: Check for collisions
        
    };
    
    return environment;
});