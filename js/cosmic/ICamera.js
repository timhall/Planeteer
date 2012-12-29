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
            matter.draw(this.position, this.scale); 
        }
    };
    
    return ICamera;
});