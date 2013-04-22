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
        setupTracking.call(this);
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
        }
    });

    var setupTracking = function () {
        var following, selected;

        if (this.stage) {
            // Setup full size rectangle to track clicks
            var tracking = new Kinetic.Rect({
                width: this.stage.attrs.width,
                height: this.stage.attrs.height,
                opacity: 0
            });
            tracking.isTrackingLayer = true;

            // Add tracking layer
            this.layer('tracking', [
                { display: tracking }
            ]);

            // "Touch start" event handler
            var touchstart = function (e) {
                // Trigger touchstart on shape
                var shape = getShape(e);
                if (shape && shape.underlying && shape.underlying.trigger) {
                    shape.underlying.trigger('touchstart', e);
                    selected = shape;
                    cosmic.selected = selected.underlying;
                }
                
                // Trigger touchstart on hub
                cosmic.hub.trigger('touchstart', e, selected);
                following = true;
            };

            // "Touch move" event handler
            var touchmove = function (e) {
                if (following) {
                    if (selected && selected.underlying && selected.underlying.trigger) {
                        selected.underlying.trigger('touchmove', e);
                    }

                    cosmic.hub.trigger('touchmove', e, selected);   
                }
            };

            // "Touch end" event handler
            var touchend = function (e) {
                if (selected && selected.underlying && selected.underlying.trigger) {
                    selected.underlying.trigger('touchend', e);
                }

                cosmic.hub.trigger('touchend', e);
                cosmic.selected = selected = undefined;
                following = false;
            }

            // Setup event listeners
            this.stage.on('mousedown' || 'touchstart', touchstart);
            this.stage.on('mousemove' || 'touchmove', touchmove);
            this.stage.on('mouseup' || 'touchend', touchend);
        }
    };

    var getShape = function (event) {
        // Pull targetNode (set up by Kinetic)
        var shape = event && event.targetNode;

        // Find root shape
        if (shape) {
            while (shape.parent.nodeType != 'Layer') { shape = shape.parent; }
        }

        return shape;
    };

    return KineticCamera;

})(cosmic.CameraBase, _, Kinetic);
