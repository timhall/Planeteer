define(
['cosmic', 'fabric', 'underscore'],
function (cosmic, fabric, _) {
    var beenAddedProp = '_hasBeenAdded',
        canvasOptions = { 
            renderOnAddition: false
        };
    
    var FabricCamera = function (id) {
        cosmic.ICamera.call(this, {});
        
        // Create a new canvas
        this.canvas = new fabric.Canvas(id, canvasOptions);
        
        return this;
    };
    _.extend(FabricCamera.prototype, cosmic.ICamera.prototype, {
        render: function (environment) {
            var camera = this;
            
            _.each(environment.objects, function (obj) {
                if (!obj.display[beenAddedProp]) {
                    camera.canvas.add(obj.display);
                    obj.display[beenAddedProp] = true;
                }
                
                obj.draw(camera.position, camera.scale); 
            });
            
            this.canvas.renderAll();
        },
        // panTo, zoomTo...
    });
    
    return FabricCamera;
})