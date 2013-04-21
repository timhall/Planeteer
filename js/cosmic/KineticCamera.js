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
