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
define(
['underscore', 'cosmic/environment'],
function (_, environment) {
    
    /**
     * Basic camera interface
     */
    var CameraBase = function () {
        // Set instance properties: 
        // Position (relative to environment origin)
        // Zoom (+/-1)
        
        this.position = { x: 0, y: 0 };
        this.scale = 1;
        this.viewSize = {x: 800, y: 600};
        this.initSize = {x: 800, y: 600};
        
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
        this.position.x = this.position.y = 0;
        this.scale = 1;
        this.following = null;
    }
    
    CameraBase.prototype.zoom = function (zoom) {
        var newSize = {},
            center = {x:this.position.x + this.viewSize.x/2, y:this.position.y + this.viewSize.y/2};
        
        this.scale = zoom;
        
        newSize.x = this.initSize.x / zoom;
        newSize.y = this.initSize.y / zoom;
        
        this.position.x = center.x - newSize.x/2;
        this.position.y = center.y - newSize.y/2;
        
        this.viewSize.x = newSize.x;
        this.viewSize.y = newSize.y;
    }
    
    
    return CameraBase;
});
