/**
 * Camera interface to implement for specific camera implmentations
 * 
 * How to implement:
 * 
 * // Create Camera class
 * var Camera = function () {
 *     // Implement instance properties
 *     ICamera.call(this);
 * };
 * 
 * // Implement prototype and create render function
 * Camera.prototype = ICamera.prototype;
 * Camera.prototype.renderLayer = function (layer) { ... };
 * 
 */
define(
['underscore'],
function (_) {
    
    /**
     * Basic camera interface
     */
    var ICamera = function () {
        // Set instance properties: 
        // Position (relative to environment origin)
        // Zoom (+/-1)
        
        this.position = { x: 0, y: 0 };
        this.scale = 1;
        
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
    ICamera.prototype.render = function (layer) {
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
    ICamera.prototype.renderLayer = function (layer) {
        throw new Error('render layer function for ICamera implementation must be defined');  
    };
    
    /**
     * Getter/setter for layers
     *
     * @param {String} layer name to set/set
     * @param {Object} [objects] Set objects array to render
     * @prototype
     */
    ICamera.prototype.layer = function (layer, objects) {
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
    ICamera.prototype.drawMatter = function (matter) {
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
    ICamera.prototype.follow = function (object) {
        console.log('called');
        this.following = object;
        console.log(this.following);
    }
    
    ICamera.prototype.stopFollow = function () {
        this.following = null;
    }
    
    ICamera.prototype.center = function (object) {
        this.following = null;
        this.position.x = object.x - 400/this.scale;
        this.position.y = object.y - 300/this.scale;
    }
    
    ICamera.prototype.reset = function () {
        this.position.x = this.position.y = 0;
        this.scale = 1;
        this.following = null;
    }
    
    return ICamera;
});
