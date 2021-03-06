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
                    /*
                    if (this.options.type != 'Destination' && obj.options.type != 'Destination') {
                        //console.log(this.options.type, obj.options.type);
                        bounce(obj, this);
                    }
                    if (this.options.type == 'Planet' && obj.options.type == 'Planet') {
                        cosmic.reset();
                    }
                    */
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
        
        if (bounding(matter).box !== undefined) {
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
        } else if (bounding(matter).radius !== undefined) {
            
        }
    };
    
    /**
     * Perform bounce between two objects,
     * only affecting first object
     * (have to call the inverse for other object)
     * 
     * @param {Body} active
     * @param {Body} other
     */
    var bounce = collisions.utils.bounce = function (active, other) {
        var impactAngle = utils.angle(active, other);
    
        // Flip angle around impact angle and then flip (-180)
        var newAngle = impactAngle + (impactAngle - active.v.angle()) - 180;
        var newMagnitude = Math.abs(
            (active.v.magnitude() * (active.mass - other.mass) + 2 * other.mass * other.v.magnitude()) / (active.mass + other.mass)
        );
        
        // Set angle and magnitude
        if (active.v.magnitude() > 0) {
            active.v.angle(newAngle > 360 ? newAngle - 360 : newAngle);
            active.v.magnitude(newMagnitude);
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
