cosmic.ui = (function (_, Kinetic, utils) {

    var ui = {};
    ui.objects = [];
    
    //------------------------   Ticker   --------------------------
    
    var shipData = new Kinetic.Group({
        x: 10,
        y: 10,//cosmic.camera.stage.attrs.height - 10,
    });
        
    shipData.add(new Kinetic.Text({     //This copy is to create a correctly scaled background to the real text object.
        text: 'testing',
        align: 'left',
        fontFamily: 'Calibri',
        fontSize: 12,
        textFill: 'black',
        fill: 'black',
        opacity: 0.5,
        padding: 5,
        x: -5,
        y: -5
    }));
    
    shipData.add(new Kinetic.Text({
        text: 'testing',
        align: 'left',
        fontFamily: 'Calibri',
        fontSize: 12,
        fill: 'white'
    }));
    


    var dataUpdate = function () {
        var shipJet = null;
        
        shipJet = cosmic.environment.objects[3].options.jetting;
        if (cosmic.environment.objects[3].options.jetting && cosmic.environment.objects[3].options.jetting != 0) {
            console.log(cosmic.environment.objects[3].options.jetting);
        }
        
        if (cosmic.selected) {
            var selected = cosmic.selected;
        } else {
            var selected = {options: {name: 'None'}};
        }
        
        shipData.children[0].setText(
                'Velocity: ' + utils.roundToPrecision(cosmic.environment.objects[3].v.magnitude(), 2) + '\n' + 
                'Angle: ' + utils.roundToPrecision(cosmic.environment.objects[3].v.angle()) + '\n' +
                'Thrust: ' + shipJet + '\n' +
                'Selected: ' + selected.options.name// + '\n' +
                //'Time: ' + (Math.round( cosmic.time/100 ) / 10).toFixed(1)
        );
        
        shipData.children[1].setText(shipData.children[0].attrs.text);
        
        shipData.setY(cosmic.camera.stage.attrs.height - 80 + 12);
    };
    
    ui.objects.push({ display: shipData, draw: dataUpdate});
    
    //------------------------   MINIMAP   --------------------------
    
    var minimap = new Kinetic.Group({
        x: 10,
        y: 10
    });
    
    minimap.add(new Kinetic.Rect({
        width: 160,
        height: 120,
        fill: 'black',
        opacity: 0.7
    }));
    
    minimap.add(new Kinetic.Rect({
        width: 164,
        height: 124,
        stroke: '#00BFFF',
        strokeWidth: 2,
        x: -2,
        y: -2,
        opacity: 0.5
    }));
    //console.log(cosmic.environment);
    
    var mapUpdate = function () {
        minimap.setX(cosmic.camera.stage.attrs.width - 165);
        minimap.setY(cosmic.camera.stage.attrs.height - 125);
        
        if (minimap.children.length < 3) {
            for (var i = 0; i < cosmic.environment.objects.length; i++) {
                minimap.add(new Kinetic.Circle({
                    radius: cosmic.environment.objects[i].options.radius / 10,
                    fill: cosmic.environment.objects[i].options.color,
                    opacity: 1,
                    parObject: cosmic.environment.objects[i]
                }));
            }
            
            minimap.add(new Kinetic.Rect({
                stroke: 'white',
                strokeWidth: 1,
                parObject: cosmic.camera,
                width: 5,
                height: 5
            }));
        }
        
        for (var i = 2; i < minimap.children.length; i++) {
            minimap.children[i].setX(minimap.children[i].attrs.parObject.x / 10);
            minimap.children[i].setY(minimap.children[i].attrs.parObject.y / 10);
        }
        
        //Camera readout. Probably not final.
        minimap.children[minimap.children.length-1].setX(minimap.children[minimap.children.length-1].attrs.parObject.position.x / 10);
        minimap.children[minimap.children.length-1].setY(minimap.children[minimap.children.length-1].attrs.parObject.position.y / 10);
        minimap.children[minimap.children.length-1].setWidth(minimap.children[minimap.children.length-1].attrs.parObject.viewSize.x / 10);
        minimap.children[minimap.children.length-1].setHeight(minimap.children[minimap.children.length-1].attrs.parObject.viewSize.y / 10);
        //console.log(minimap.children[2].attrs.parObject);
    };
    
    ui.objects.push({ display: minimap, draw: mapUpdate});
    
    //------------------------   SELECTION   --------------------------
    
    var selection = new Kinetic.Group({
        x: 160,
        y: 400,
        init: false
    })
    
    /*selection.add(new Kinetic.Circle({
        fill: 'white',
        radius: 35
    }));*/
    
    selection.add(new Kinetic.Text({
        text: 'null',
        fill: 'white',
        align: 'center',
        width: 80
    }))
    
    selection.add(new Kinetic.Group());
    
    var selectUpdate = function () {
        if (!selection.attrs.init) {
            selection.setX(cosmic.camera.stage.attrs.width - 220);
            selection.setY(cosmic.camera.stage.attrs.height - 65);
            selection.children[0].setOffset(40,-40);
            
            selection.attrs.init = true;
        } 
        
        if (selection.children[1]) {
            selection.children.splice(1,1);
        }
        
        if (cosmic.selected) {
            var selected = cosmic.selected;
            selection.children[1] = cosmic.selected.display;
            
            if (cosmic.selected.options.type == 'Ship' && cosmic.selected.display.children[0].shapeType == 'Spline') {
                selection.children[1].children.splice(0,2);
            }
            
            selection.children[1].setX(selection.attrs.x);
            selection.children[1].setY(selection.attrs.y);
            selection.children[1].setScale(35/25/1.2),
            selection.children[1].setRotation(0);
        } else {
            var selected = {options: {name: 'None'}};
        }
        
        
        
        selection.children[0].setText(selected.options.name);
    }
    
    ui.objects.push({ display: selection,  draw: selectUpdate});
    
    return ui;
})(_, Kinetic, freebody.utils);
