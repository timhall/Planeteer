var cosmic = (function(global, _, Backbone, undefined){
    "use strict";

    // Define and export the freebody namespace
    var cosmic = {};

/**
 * Hold matter and advance it through physics all together
 */
cosmic.environment = (function (freebody, _) {

    var environment = {},
        gravityScale = 1.82;
        
    environment.objects = [];
    environment.planets = [];
    environment.bodies = [];
    environment.paused = false;
    
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
    environment.addDestination = function (destination) {
        this.addObject(destination, 'destination')
    }
    
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
        if (this.paused == false) {
            // Advance physics for objects by timestep
            _.each(environment.objects, function (obj) {
                if (_.isFunction(obj.advance)) {
                    obj.advance(timestep);
                }
            });
            
            // Check for collisions
            _.each(environment.objects, function (obj, i) {
                if (_.isFunction(obj.collision)) {
                    // Check for collision with remaining objects
                    for (var j = i + 1; j < environment.objects.length; j += 1) {
                        obj.collision(environment.objects[j]);
                    }
                }
            });
            
            // Check for out-of-bounds
            _.each(environment.objects, function (obj) {
                environment.outOfBounds(obj);
            });
            
            // Check for path refresh timing and run if necessary
            _.each(environment.objects, function (obj) {
                if (_.isFunction(obj.pathRun)) {
                    if (obj.options.pathTime && cosmic.time - obj.options.pathTime > 7000) {
                        obj.pathRun(10000, 100, cosmic.time);
                    }
                }
            });
        }
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
})(freebody, _);

/**
 * Camera interface to implement for specific camera implmentations
 * 
 * How to implement:
 * 
 * // Create Camera class
 * var Camera = function () {
 *     // Implement instance properties
 *     CameraBase.call(this);
 * };
 * 
 * // Implement prototype and create render function
 * Camera.prototype = CameraBase.prototype;
 * Camera.prototype.renderLayer = function (layer) { ... };
 * 
 */
cosmic.CameraBase = (function (_, environment) {
    
    /**
     * Basic camera interface
     */
    var CameraBase = function () {
        // Set instance properties: 
        // Position (relative to environment origin)
        // Zoom (+/-1)
        
        this.position = { x: 0, y: 0 };
        this.scale = 1;
        this.initSize = {x: 800, y: 600};
        this.viewSize = {x: this.initSize.x / this.scale, y: this.initSize.y / this.scale};
        
        // Internal properties
        this._layers = {};
        this.following = null;
    };
    
    /**
     * Main render function for camera
     * 
     * @param {String} [layer] specific layer to render, otherwise all layers
     * @prototype
     */
    CameraBase.prototype.render = function (layer) {
        var camera = this;
        
        if (layer) {
            camera.renderLayer.call(camera, layer);
        } else {
            _.each(_.keys(camera._layers), camera.renderLayer, camera);
        }
    };
    
    /**
     * Render specific layer
     * 
     * @param {String} layer to render
     * @prototype
     */
    CameraBase.prototype.renderLayer = function (layer) {
        throw new Error('render layer function for CameraBase implementation must be defined');  
    };
    
    /**
     * Getter/setter for layers
     *
     * @param {String} layer name to set/set
     * @param {Object} [objects] Set objects array to render
     * @prototype
     */
    CameraBase.prototype.layer = function (layer, objects) {
        if (_.isUndefined(objects)) {
            // Getter
            return this._layers[layer];
        } else {
            // Setter
            this._layers[layer] = objects;
        }
    };
    
    /**
     * Helper method for drawing the specified matter
     * 
     * @param {Matter} matter to draw
     * @prototype
     */
    CameraBase.prototype.drawMatter = function (matter) {
        if (matter && _.isFunction(matter.draw)) {
            // TODO: Handle zoom in offset that's passed to draw()
            if (this.following) {
                //console.log(this.following);
                this.position.x = this.following.x - 400/this.scale;
                this.position.y = this.following.y - 300/this.scale;
                //console.log(this.position.x + ' | ' +  this.position.y)
            }
            matter.draw(this.position, this.scale); 
        }
    };
    
    
    /**
     * Improved camera functionality
     * Follow or one-time center on an object
     * @param {Object?} object to focus on
     * @prototype
     */
    CameraBase.prototype.follow = function (object) {
        console.log('called');
        this.following = object;
        console.log(this.following);
    }
    
    CameraBase.prototype.stopFollow = function () {
        this.following = null;
    }
    
    CameraBase.prototype.center = function (object) {
        this.following = null;
        if (object) {
            this.position.x = object.x - (this.viewSize.x/2);
            this.position.y = object.y - (this.viewSize.y/2);
        } else {
            this.position.x = environment.bounds.width/2 - this.viewSize.x/2;
            this.position.y = environment.bounds.height/2 - this.viewSize.y/2;
        }
    }
    
    CameraBase.prototype.reset = function () {
        this.position.x = this.defaults.position.x;
        this.position.y = this.defaults.position.y;
        this.scale = this.defaults.scale;
        this.following = this.defaults.following;
    }
    
    CameraBase.prototype.zoom = function (zoom) {
        //Difficulty correctly initializing viewSize, causes jump on first instance of zoom. Currently hardcoded in planeteer.
        var newSize = {},
            center = {x:this.position.x + this.viewSize.x/2, y:this.position.y + this.viewSize.y/2};
        
        this.scale = zoom;
        
        newSize.x = this.initSize.x / zoom;
        newSize.y = this.initSize.y / zoom;
        
        console.log(this.position.x + this.viewSize.x/2);
        this.position.x = center.x - newSize.x/2;
        this.position.y = center.y - newSize.y/2;
        console.log(this.position.x + this.viewSize.x/2);
        
        this.viewSize.x = newSize.x;
        this.viewSize.y = newSize.y;
    }
    
    
    return CameraBase;
})(_, cosmic.environment);

cosmic.collisions = (function (freebody, _) {
    var collisions = {},
        utils = freebody.utils;
    
    /**
     * Center Distance
     * ===============
     * 
     * Use the center distance approach with a bounding circle
     */
    collisions.centerDistance = {
        
        /**
         * Set bounding around object to radius from center
         * 
         * @param {Object} obj to apply bounding to
         * @param {Number} radius
         */
        setBounding: function (obj, radius) {
            bounding(obj, { radius: radius });
        },
        
        methods: {
            checkCollision: function (obj) {
                var centerDistance = utils.distance(this, obj),
                    collisionDistance = bounding(this).radius + bounding(obj).radius;
                
                if (centerDistance <= collisionDistance) {
                    //if (typeof this == ball) {
                    //    forceExertedOnCircle(this, obj);
                    //}
                    //forceExertedOnCircle(obj, this);
                        //console.log(this.options.type, obj.options.type);
                    if (this.options.type != 'Destination' && obj.options.type != 'Destination') {
                        //console.log(this.options.type, obj.options.type);
                        bounce(obj, this);
                    }
                    if (this.options.type == 'Planet' && obj.options.type == 'Planet') {
                        cosmic.reset();
                    }
                    return true;
                };
            }     
        } 
    };
    
    
    /**
     * Bounding Box
     * ============
     * 
     * Use the bounding box approach
     */
    collisions.boundingBox = {
        
        /**
         * Set bounding around object to bounding box
         * 
         * @param {Object} obj to apply bounding to
         * @param {Number} width of bounding box
         *     (defined as midway and perpendicular to offset)
         * @param {Number} height of bounding box (parallel to offset)
         * @param {Number} offsetLength distance from center of matter to side of bounding box
         * @param {Number} theta (degrees) of offset relative to matter angle
         */
        setBounding: function (obj, width, height, offsetLength, theta) {
            boundingBox(obj, width, height, offsetLength, theta);
        },
        
        methods: {
            checkCollision: function (obj) {
                var matter = this;
                
                // Step 1: Check center distance
                // -----------------------------
                if (!collisions.centerDistance.checkCollision.call(matter, obj)) {
                    return false;
                }
                
                // Step 2: Check bounding box
                // --------------------------
                // Check whether any point of object's bounding box is within
                // matter's bounding box
                return !!_.find(boundingBox(obj), function (point) {
                    return pointIsInsideMatter(point, matter)
                });
            }
        }
    }
    
    
    // Utils
    // =====
    collisions.utils = {};
    
    
    /**
     * Get/set bounding box for matter
     * 
     * @param {Matter} matter to get/set bounding box on
     * @param {Number} width of bounding box
     *     (defined as midway and perpendicular to offset)
     * @param {Number} height of bounding box (parallel to offset)
     * @param {Number} offsetLength distance from center of matter to side of bounding box
     * @param {Number} theta (degrees) of offset relative to matter angle
     * @return {Array} points of bounding box
     */
    var boundingBox = collisions.utils.boundingBox = function (matter, width, height, offsetLength, theta) {
        // If width is defined, assume setter
        if (!_.isUndefined(width)) {
            // Store bounding box info
            bounding(matter, {
                box: {
                    width: width,
                    height: height,
                    offsetLength: offsetLength,
                    theta: theta
                }
            });
            
            // Store maximum distance to point as bounding radius
            bounding(matter, { radius: boundingRadiusFromBox(matter) });
        } 
        
        // For getter or setter, return points for bounding box
        return boundingBoxPoints(matter)
    };
    
    
    /**
     * Get bounding box points array for given matter
     * 
     * @param {Matter} matter with bounding box to get points for
     * @return {Array} points
     */
    var boundingBoxPoints = collisions.utils.boundingBoxPoints = function (matter) {
        var box = bounding(matter).box,
            angle = box.theta + matter.angle,
            points = [],
            middlePoint;
        
        middlePoint = utils.relativePoint(matter, angle, box.offsetLength);
        points[0] = utils.relativePoint(middlePoint, angle - 90, box.width / 2);
        points[3] = utils.relativePoint(middlePoint, angle + 90, box.width / 2);
        
        points[1] = utils.relativePoint(points[0], angle - 180, box.height);
        points[2] = utils.relativePoint(points[3], angle - 180, box.height);
        
        return points;
    };
    
    
    /**
     * Find bounding radius from matter with bounding box
     * 
     * @param {Matter} matter with bounding box to find bounding radius
     * @return {Number} radius
     */
    var boundingRadiusFromBox = collisions.utils.boundingRadiusFromBox = function (matter) {
        // Get points of bounding box
        var points = boundingBoxPoints(matter);
        
        var maxDistance = 0;
        for (var i = 0; i < points.length; i += 1) {
            // Find distance from center of matter to point
            var distance = utils.distance(points[i], matter);
            
            // Check against maximum distance
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }
        
        return maxDistance;
    };
    
    
    /**
     * Check if given point is within given matter
     * 
     * @param {Point} point x- and y-coordinates for point
     * @param {Matter} matter with bounding box to check point against
     */
    var pointIsInsideMatter = collisions.utils.pointIsInsideMatter = function (point, matter) {
        // Approach:
        // ---------
        //
        // 1. Adjust point so that it is rotated into coordinate system where
        //    the matter's center is 0, 0 and bounding box's angle is 0 deg
        // 2. Find simple left, right, top, bottom of bounding box since it's
        //    relative orientation is now 0 deg
        //
        
        // Get bounding box for matter
        var box = bounding(matter).box;
        
        // Find distance from center of matter to point
        var distance = utils.distance(point, matter);
        
        // Find angle from matter to point
        var angle = utils.angle(matter, point);
        
        // Rotate angle to account for bounding box angle and angle of matter
        angle -= box.theta + matter.angle;
        
        // Find point that is relative to matter as 0,0 (rotated and distance)
        // (undefined sets initial point as 0, 0)
        var relativePoint = utils.relativePoint(undefined, angle, distance);
        
        // Find bounding box parameters
        var left = box.offsetLength - box.height,
            right = box.offsetLength,
            top = box.width/2,
            bottom = -box.width/2;
        
        // Finally, check if point is inside box parameters
        return relativePoint.x >= left 
            && relativePoint.x <= right 
            && relativePoint.y >= bottom 
            && relativePoint.y <= top;
    };
    
    /**
     * Find amount of force exerted on each object.
     * 
     * 
     */ 
    //I believe the velocity equation is v1' = (m2v2)/m1
    //Actually no. Close, but too elastic or whatno
    
    
    var forceExertedOnCircle = function (A, B) {
        // Determine the angle from the center of the planet to the center of the ship
        // (Why do you think the neg is here)
        var impactAngle = -utils.angle(A, B);
        
        // Get current velocity
        var forceTotal = B.v.magnitude();
        var forceAngle = -B.v.angle();
        
        // Since the planet velocity isn't affected the ship velocity is constant
        // (Won't be case for ship-to-ship)
        // ship.v.magnitude(constant...);
        
        var forceExerted = forceTotal * Math.abs(Math.cos(utils.radians(forceAngle - impactAngle))); //I don't think this is correct, but it's close
        
        // Set angle of ship based on impact angle
        // (This is interesting, the two 90s seem strange and probably won't work for ship-to-ship)
        B.v.angle(-(B.v.angle() - (2*(90 - impactAngle))));
        
        // Adjust angle if necessary to keep between 0 and 360
        if (B.v.angle() > 360) { B.v.angle(B.v.angle() - 360); 
        
        if (A.mass * A.v.magnitude()) {
        B.v.magnitude((A.mass * A.v.magnitude()) / B.mass);         //Just trying stuff out
        }
        
        }
        
        //console.log(impactAngle);
        //console.log(forceAngle);
        //console.log('Force exerted: ' + forceExerted + ' | Magnitude ' + ship.v.magnitude() + ' | Multiplier: ' + Math.abs(Math.cos(utils.radians(forceAngle - impactAngle))));
        //console.log(ship.v.angle() + ' | ' + Math.abs(ship.v.angle() + forceAngle))
        
    };
    
    var bounce = function (A, B) {
        var impactAngle = utils.angle(A, B);
        //console.log('Bounce: ', A, B);
    
        // Flip angle around impact angle and then flip (-180)
        var angleANew = impactAngle + (impactAngle - A.v.angle()) - 180;
        var angleBNew = impactAngle + (impactAngle - B.v.angle()) - 180;
        
        var magANew = Math.abs((A.v.magnitude() * (A.mass - B.mass) + 2 * B.mass * B.v.magnitude()) / (A.mass + B.mass));
        var magBNew = Math.abs((B.v.magnitude() * (B.mass - A.mass) + 2 * A.mass * A.v.magnitude()) / (A.mass + B.mass));
        
        
        if (A.v.magnitude() > 0) {
            A.v.angle(angleANew > 360 ? angleANew - 360 : angleANew);
            A.v.magnitude(magANew);
        }
        
        if (B.v.magnitude() > 0) {
            B.v.angle(angleBNew > 360 ? angleBNew - 360 : angleBNew);
            B.v.magnitude(magBNew);
        }
    };
    
    
    
    /**
     * Get/set bounding property on Matter prototype
     * 
     * @param {Matter} matter to get/set bounding on
     * @param {Object} [options] bounding options to set
     * @return {Object} bounding
     */
    var boundingProp = '_bounding';
    var bounding = collisions.utils.bounding = function (matter, options) {
        if (!_.isUndefined(options)) {
            // Setter
            matter[boundingProp] = _.extend(matter[boundingProp] || {}, options);
        } else if (_.isUndefined(matter[boundingProp])) {
            matter[boundingProp] = {};
        }
        
        return matter[boundingProp];
    };
    
    return collisions;
})(freebody, _);

/**
 * Matter in the universe with physics and display
 */
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

cosmic.gamePiece = (function (Matter, collisions, _, Kinetic) {

    /**
     * Wrapper for "game piece" functionality
     */
    var gamePiece = function () {
        var piece = this;
        
        // Generic GamePiece object that's being created
        var GamePiece = function (options) {
            // Setup options
            this.options = _.defaults(options, GamePiece.defaults);

            // Extend Matter
            Matter.call(this, this.options);
            
            // Create display
            this.display = this._create.call(this);

            // Setup bounding (if specified)
            if (_.isFunction(this._setBounding)) {
                this._setBounding.call(this);    
            }

            // Setup events
            this._setupEvents();

            return this;
        };

        // Extensions
        _.extend(GamePiece.prototype,
            Matter.prototype
        );

        /**
         * Set default options for game piece
         *
         * @param {Object} options
         * @chainable
         */
        piece.defaults = function (options) {
            // Add static defaults to GamePiece
            GamePiece.defaults = options;

            // Return for chaining
            return piece;
        };

        /**
         * Add methods to game piece prototype
         *
         * @param {Object} methods
         * @chainable
         */
        piece.methods = function (methods) {
            // Add methods to prototype
            _.extend(GamePiece.prototype, methods);

            // Return for chaining
            return piece;
        };

        /**
         * Function for creating display of game piece
         *
         * @param {Function} create function that returns display object
         * @chainable
         */
        piece.display = function (create) {
            GamePiece.prototype._create = create;
            return piece;
        };

        /**
         * Events and the functions to respond to them with
         *
         * Example: 
         * .events({ 
         *   'click': function () {...}, 
         *   'remove': 'methodname' 
         * })
         * 
         * @param {Object} events object
         * @chainable
         */
        piece.events = function (events) {
            GamePiece.prototype._setupEvents = function () {
                var self = this;

                _.each(events, function (callback, key) {
                    if (_.isString(callback)) {
                        callback = self[callback];
                    }
                    self.on(key, callback);
                });
            }

            return piece;
        };

        /**
         * Setup collisions on object
         *
         * Example:
         * .collisions('centerDistance', function (bounding) {
         *   bounding(this.options.radius);
         * })
         * 
         * @param {String} strategy
         * @param {Function} bounding function
         * @chainable
         */
        piece.collisions = function (strategy, bounding) {
            // Find collision approach for strategy
            var collision = collisions[strategy];
            if (collision) {
                _.extend(GamePiece.prototype, 
                    collision.methods, {
                    _setBounding: function () {
                        bounding.call(this, collision.setBounding);        
                    }
                });
            }
            return piece;
        };

        /**
         * Construct game piece for later instantiation
         *
         * @return GamePiece object
         */
        piece.construct = function () {
            return GamePiece;
        };

        /**
         * Create an instance of the GamePiece
         *
         * @param {Object} options
         * @return instantiated GamePiece object
         */
        piece.create = function (options) {
            return new piece.construct(options);    
        };

        return piece;
    };

    // Finally, return
    return gamePiece;

})(cosmic.Matter, cosmic.collisions, _, Kinetic);

cosmic.KineticCamera = (function (CameraBase, _, Kinetic) {
    /**
     * Camera implmentation using Kinetic
     */
    var KineticCamera = function (containerId, options) {
        // Implement instance properties
        CameraBase.call(this);
        
        // Create main stage
        this.stage = new Kinetic.Stage({
            container: containerId,
            width: (options && options.width) || 800,
            height: (options && options.height) || 600
        });
        
        this._displayLayers = {};
        this._initTracking();
        //console.log(this);
    };
    
    _.extend(KineticCamera.prototype, CameraBase.prototype, {
        renderLayer: function (layerName) {
            var camera = this,
                layer = camera._layers[layerName],
                displayLayer = camera._displayLayers[layerName];
            
            if (layer) {
                // Create a display layer (if necessary)
                if (!displayLayer) {
                    displayLayer = camera._addLayer(layerName);
                }
                
                // Draw objects in layer
                _.each(layer, function (obj) {
                    camera._addObjectToLayer(obj, displayLayer);
                    camera.drawMatter(obj);
                });
                
                // Draw layer
                displayLayer.draw();
            }
        },
        
        _addLayer: function (layerName) {
            // Create new Kinetic layer
            var displayLayer = new Kinetic.Layer();
            displayLayer.name = layerName;
            
            // Store reference to layer
            this._displayLayers[layerName] = displayLayer;
            
            // Add layer to stage
            this.stage.add(displayLayer);
            
            return displayLayer;
        },
        
        _addObjectToLayer: function (obj, displayLayer) {
            if (obj.display.layer != displayLayer.name) {
                // Add display of object to layer and store layer name
                displayLayer.add(obj.display)
                obj.display.layer = displayLayer.name;
            }  
        },
        
        _initTracking: function () {
            if (this.stage) {
                //var trackingObject = new Kinetic.Group();
                //art.background(trackingObject, this.stage);
                var trackingObject = new Kinetic.Rect({
                    width: this.stage.attrs.width,
                    height: this.stage.attrs.height,
                    opacity: 1,
                    fill: '#FFFFFFF'
                });
                trackingObject.isTracking = true;
                
                this.layer('tracking', [
                    { display: trackingObject }
                ]);
                
                var _selected;
                var _dragging;
                var _mouseMove = {x: 0, y: 0};
                this.stage.on('mousedown' || 'touchstart', function (e) {
                    var shape = getShape(e);
                    console.log(e);
                    if (!shape.isTracking && !e.ctrlKey && !e.shiftKey) {
                        cosmic.pausePhysics();
                        _selected = shape;
                        if (shape.select) {    
                            shape.select(e);
                        } else {
                            cosmic.selected = null;
                        }
                    }
                    if (e.ctrlKey && !e.shiftKey) {
                        //camera.center(shape);
                        cosmic.camera.following = null;
                        var prePosX = cosmic.camera.position.x;
                        var prePosY = cosmic.camera.position.y;
                        cosmic.camera.position.x = ((e.layerX)/cosmic.camera.scale) + prePosX - (400/cosmic.camera.scale);
                        cosmic.camera.position.y = ((e.layerY)/cosmic.camera.scale) + prePosY - (300/cosmic.camera.scale);
                    }
                    if (e.shiftKey) {
                        cosmic.camera.following = null;
                        _dragging = true;
                        _mouseMove.x = e.layerX;
                        _mouseMove.y = e.layerY;
                    }
                    if (e.shiftKey && e.ctrlKey) {
                        console.log(shape);
                        _selected = shape;
                        _selected.followClick(e);
                        if (shape.select) {    
                            shape.select(e);
                        }
                    }
                    
                });
                this.stage.on('mousemove' || 'touchmove', function (e) {
                    if (_selected && !e.shiftKey) {
                        _selected.move(e);
                        //console.log(e);
                    }
                    if (e.shiftKey && _dragging) {
                        cosmic.camera.position.x += (_mouseMove.x - e.layerX)/cosmic.camera.scale;
                        cosmic.camera.position.y += (_mouseMove.y - e.layerY)/cosmic.camera.scale;
                        _mouseMove.x = e.layerX;
                        _mouseMove.y = e.layerY;
                    }
                });
                this.stage.on('mouseup' || 'touchend', function (e) {
                    _selected = _dragging = undefined;
                    cosmic.unpause();
                });
                
                document.addEventListener('mousewheel', function (e) {
                   if (cosmic.camera.scale + e.wheelDeltaY/1440 > 0.15 && cosmic.camera.scale + e.wheelDeltaY/1440 < 2) {
                        cosmic.camera.zoom(cosmic.camera.scale + (cosmic.camera.scale*e.wheelDeltaY/1440));
                   }
                }, true);
            }
            
            var getShape = function (event) {
                var shape = event && event.targetNode;
                if (shape) {
                    while (shape.parent.nodeType != 'Layer') { shape = shape.parent; }
                }
                return shape;
            }
        }
    });
    return KineticCamera;
})(cosmic.CameraBase, _, Kinetic);

var rAF = window.requestAnimationFrame,
    _paused = false,
    _pausedPhysics = false,
    initStart = false,
    selected = {};

cosmic.start = function () {
    cosmic.unpause();
    cosmic.progress();
};
cosmic.startRendering = function () {
    cosmic.unpause();
    cosmic.pausePhysics();
    cosmic.progress();
};

cosmic.progress = function (timestamp) {
    if (!_paused) {    
        // Setup next progress
        rAF(cosmic.progress);
              
        if (!_pausedPhysics) {
            //console.log(_paused)
            // Update physics
            cosmic.environment.advance(timestamp - (cosmic.time || timestamp));
        }
              
        // Update time
        cosmic.time = timestamp;
              
        // Render updated objects
        if (cosmic.beforeRender) { cosmic.beforeRender(); }
              
        if (cosmic.camera) {      
            cosmic.camera.render();
        }
    }
};
    
cosmic.reset = function () {
    _.each(cosmic.environment.objects, function (object) {
        object.x = Math.floor(Math.random()*1400 + 100);
        object.y = Math.floor(Math.random()*1200 + 100);
        cosmic.camera.reset();
        cosmic.iteration += 1;
        console.log(cosmic.iteration);
    })
}
  
cosmic.pause = function () {
    _paused = true;
};
cosmic.pausePhysics = function () {
    _pausedPhysics = true;
};
cosmic.unpause = function () {
    _paused = false;
    _pausedPhysics = false;
       
    //somewhat janky logic
    //mousedown forces pause and mouseup forces unpause
    //so it can be assumed that every player action is associated with an unpause
    //therefore it refreshes on each unpause
       
    _.each(environment.objects, function (obj) {
        if (obj.pathRun) {obj.pathRun(10000, 100, cosmic.time);}
    });
}
  
cosmic.step = function () {
    cosmic.start();
    cosmic.pause();
};


    return cosmic;
})(this, _, Backbone);