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
            width: (options && options.width) || 1000,
            height: (options && options.height) || 750
        });
        
        this._displayLayers = {};
        this._setupTracking();
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
        
        _setupTracking: function () {
            var self = this,
                handlers = {},
                tracking, selected, shifting;
    
            // "Touch start" event handler
            handlers.touchstart = function (e) {
                // Get shape from event
                var shape = getShape(e),
                    selection = shape.underlying;
                
                // Trigger touchstart on hub
                cosmic.hub.trigger('touchstart', e, selection);
                cosmic.selected = selected = selection;
                
                // Trigger event on shape unless handled
                if (!e.handled && selection && selection.trigger) {
                    selection.trigger('touchstart', e);
                }
                
                tracking = true;
            };

            // "Touch move" event handler
            handlers.touchmove = function (e) {
                if (tracking) {
                    cosmic.hub.trigger('touchmove', e, selected);
                    
                    if (!e.handled && selected && selected.trigger) {
                        selected.trigger('touchmove', e);
                    }   
                }
            };

            // "Touch end" event handler
            handlers.touchend = function (e) {
                cosmic.hub.trigger('touchend', e, selected);
                
                if (!e.handled && selected && selected.trigger) {
                    selected.trigger('touchend', e);
                }
                
                cosmic.selected = selected = undefined;
                tracking = false;
            }
            
            handlers.scale = function (value) {
                var zoom = self.scale * (1 + value);
                if (zoom > 0.15 && zoom < 2) {
                    self.zoom(zoom);
                    cosmic.hub.trigger('camera:zoom', zoom);
                }
            }
    
            // Add listeners
            if (self.stage) {
                // Setup event listeners on stage
                self.stage.on('mousedown' || 'touchstart', handlers.touchstart);
                self.stage.on('mousemove' || 'touchmove', handlers.touchmove);
            }
            
            document.addEventListener('mouseup', handlers.touchend);
            document.addEventListener('mousewheel', function (e) {
                handlers.scale(e.wheelDeltaY/1440);
            });
            
            cosmic.hub.on('touchstart', function (e, selection) {
                if (selection && e.ctrlKey && e.shiftKey) {
                    // Follow: if something is selected and ctrl + shift
                    self.follow(selection);
                
                    e.handled = true;
                } else if (e.ctrlKey && !e.shiftKey) {
                    // Center: ctrl
                    
                    self.following = undefined;
                    var prePosX = self.position.x;
                    var prePosY = self.position.y;
                    self.position.x = ((e.layerX)/self.scale) + prePosX - (400/self.scale);
                    self.position.y = ((e.layerY)/self.scale) + prePosY - (300/self.scale);
                    
                    cosmic.hub.trigger('camera:center', self);
                    e.handled = true;
                } else if (e.shiftKey && !e.ctrlKey) {
                    // Pan: shift + drag
                    
                    shifting = {
                        x: e.layerX,
                        y: e.layerY
                    };
                    
                    e.handled = true;
                }
            });
            
            cosmic.hub.on('touchmove', function (e, selection) {
                if (shifting !== undefined && e.shiftKey && self) {
                    self.position.x += (shifting.x - e.layerX)/self.scale;
                    self.position.y += (shifting.y - e.layerY)/self.scale;
                    shifting.x = e.layerX;
                    shifting.y = e.layerY;
                    
                    cosmic.hub.trigger('camera:pan', self);
                    e.handled = true;
                } 
            });
            
            cosmic.hub.on('touchend', function (e, selection) {
                shifting = undefined;
            });
        }
    });

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
