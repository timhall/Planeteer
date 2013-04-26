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
                'Misc: ' + cosmic.camera.position.x + ', ' + cosmic.camera.position.y + ', ' + cosmic.camera.scale// + '\n' +
                //'Time: ' + (Math.round( cosmic.time/100 ) / 10).toFixed(1)
        );
        
        shipData.children[1].setText(shipData.children[0].attrs.text);
        
        shipData.setY(cosmic.camera.stage.attrs.height - 80 + 12);
    };
    
    //ui.objects.push({ display: shipData, draw: dataUpdate});
    
    //------------------------   MINIMAP   --------------------------
    
    var minimap = new Kinetic.Group({
        x: 10,
        y: 10,
        opacity: 0.7
    });
    
    minimap.add(new Kinetic.Rect({
        width: 240,
        height: 180,
        fill: 'black',
        opacity: 0.7
    }));
    
    minimap.add(new Kinetic.Rect({
        width: 244,
        height: 184,
        stroke: '#00BFFF',
        strokeWidth: 2,
        x: -2,
        y: -2
    }));
    //console.log(cosmic.environment);
    
    var mapUpdate = function () {
        minimap.setX(cosmic.camera.stage.attrs.width - (245 + 3));
        minimap.setY(cosmic.camera.stage.attrs.height - (185 + 3));
        
        if (minimap.children.length < 3) {
            for (var i = 0; i < cosmic.environment.objects.length; i++) {
                minimap.add(new Kinetic.Circle({
                    radius: cosmic.environment.objects[i].options.radius / 20,
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
            minimap.children[i].setX(minimap.children[i].attrs.parObject.x / 20);
            minimap.children[i].setY(minimap.children[i].attrs.parObject.y / 20);
        }
        
        //Camera readout. Probably not final.
        minimap.children[minimap.children.length-1].setX(minimap.children[minimap.children.length-1].attrs.parObject.position.x / 20);
        minimap.children[minimap.children.length-1].setY(minimap.children[minimap.children.length-1].attrs.parObject.position.y / 20);
        minimap.children[minimap.children.length-1].setWidth(minimap.children[minimap.children.length-1].attrs.parObject.viewSize.x / 20);
        minimap.children[minimap.children.length-1].setHeight(minimap.children[minimap.children.length-1].attrs.parObject.viewSize.y / 20);
        //console.log(minimap.children[2].attrs.parObject);
    };
    
    ui.objects.push({ display: minimap, draw: mapUpdate});
    
    //------------------------   SELECTION   --------------------------
    // Removed from demo for now
    
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
    
    //ui.objects.push({ display: selection,  draw: selectUpdate});
    
    //------------------------   Status   --------------------------
    
    var status = new Kinetic.Group({
        x: 10,
        y: 10,
        init: false,
        stat: 'Normal',
        opacity: 0.7
    });
    
    status.add(new Kinetic.Rect({
        fill: '#00BFFF',
        width: 245,
        height: 40,
        cornerRadius: 5
    }))
    
    status.add(new Kinetic.Text({
        height: 40,
        width: 245,
        align: 'center',
        text:'No Alerts',
        fill: 'white',
        fontSize: 29,
        offset: {y:-5, x:0}
    }))
    
    var statusUpdate = function () {
        if (!status.attrs.init) {
            status.setX(cosmic.camera.stage.attrs.width - (245 + 5));
            status.setY(cosmic.camera.stage.attrs.height - (230 + 5));
            status.init = true;
        }
        
        if (status.attrs.stat == 'Normal') {
            status.children[0].setFill('#00BFFF');
            status.children[1].setText('No Alerts');
        } else if (status.attrs.stat == 'Incoming') {
            status.children[0].setFill('#B40404');
            status.children[1].setText('Collision Imminent!');
        } else if (status.attrs.stat == 'Fail') {
            status.children[0].setFill('#B40404');
            status.children[1].setText('Voyage Failed!');
        } else if (status.attrs.stat == 'Winning' ) {
            status.children[0].setFill('green');
            status.children[1].setText('Predicted Success!');
        } else if (status.attrs.stat == 'Win') {
            status.children[0].setFill('green');
            status.children[1].setText('Successful Journey!');
        } else if (status.attrs.stat == 'Escaping') {
            status.children[0].setFill('#B40404');
            status.children[1].setText('Escape Trajectory!');
        }
        
    }
    
    ui.objects.push({ display: status,  draw: statusUpdate});
    
        
    var playPauseButton = new Kinetic.Group({
        x:5,
        y:705,
        opacity: 0.7
    });
        
    playPauseButton.add(new Kinetic.Rect({
        width: 40,
        height: 40,
        fill: '#00BFFF',
        cornerRadius: 5,
    }));
    
    playPauseButton.add(new Kinetic.Polygon({
        points: [10,10,10,30,31,20],
        fill: 'white'
    }));
    
    playPauseButton.underlying = { type: 'PlayPauseButton' };
    
    var restartButton = new Kinetic.Group({
        x:50,
        y:705,
        opacity: 0.7,
    });
        
    restartButton.add(new Kinetic.Rect({
        width: 40,
        height: 40,
        fill: '#00BFFF',
        cornerRadius: 5,
    }));
    
    restartButton.underlying = { type: 'RestartButton' };
    
    cosmic.hub.on('touchend', function (e, selected) {
        if (selected && selected.type === 'PlayPauseButton') {
            cosmic.playback.toggle();
        } else if (selected && selected.type === 'RestartButton') {
            console.log('restart');
        }
    });
    
    ui.objects.push({ display: playPauseButton });
    ui.objects.push({ display: restartButton });
    
    return ui;
})(_, Kinetic, freebody.utils);
