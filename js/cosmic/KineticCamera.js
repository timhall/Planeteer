define(
['cosmic', 'underscore', 'kinetic'],
function (cosmic, _, Kinetic) {
    /**
     * Camera implmentation using Kinetic
     */
    var KineticCamera = function (containerId, options) {
        // Implement instance properties
        cosmic.CameraBase.call(this);
        
        // Create main stage
        this.stage = new Kinetic.Stage({
            container: containerId,
            width: (options && options.width) || 800,
            height: (options && options.height) || 600
        });
        
        this._displayLayers = {};
    };
    
    _.extend(KineticCamera.prototype, cosmic.CameraBase.prototype, {
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
        }
    });
    
    return KineticCamera;
});
