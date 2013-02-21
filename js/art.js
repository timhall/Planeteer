define(
['kinetic'],
function (Kinetic) {
    var art = {};
    
    art.orange = function (group, radius, preScale) {
        group.setScale(radius/25, radius/25);
        preScale = radius/25;
        
        
        group.add(new Kinetic.Circle({
            radius:25,
            fill:'#F16122'
        }));
        group.add(new Kinetic.Path({
            data:'M8.078-8.072C-1.163-7.397-8.546-6.858-8.546-6.858s8.171-1.539,15.779-4.27c7.607-2.731,11.284-5.668,11.284-5.668c1.81,1.994,3.303,4.282,4.397,6.784C22.914-10.013,17.319-8.747,8.078-8.072z',
            fill:'#F1BC96'
        }));
        group.add(new Kinetic.Path({
            data:'M-23.002,1.876c0,0,30.95-0.065,39.793-3.576C16.791-1.7-4.211,8.639-23.002,1.876z',
            fill:'#F1BC96'
        }));
        group.add(new Kinetic.Path({
            data:'M-0.05,23.291c-3.208,0.801-7.385,0.585-7.385,0.585c-2.348-0.73-4.548-1.798-6.543-3.146c0,0,4.11,0.718,9.182,0.675c5.071-0.043,10.945-0.737,10.945-0.737S3.158,22.488-0.05,23.291z',
            fill:'#F1BC96'
        }));
        group.add(new Kinetic.Path({
            data:'M-9.283-10.868c5.982-2.059,11.119-4.866,11.119-4.866s-7.64,0.771-11.899,0.771c-4.812,0-9.366-0.771-9.366-0.771c-1.45,1.788-2.658,3.78-3.574,5.926C-23.003-9.808-15.441-8.749-9.283-10.868z',
            fill:'#F1BC96'
        }));
        group.add(new Kinetic.Path({
            data:'M3.722,15.076c5.139,1.279,14.917,1.584,14.917,1.584c2.295-2.565,4.068-5.609,5.152-8.961c0,0-8.843,3.281-15.562,3.563c-6.719,0.282-17.165-0.737-17.165-0.737S-1.675,13.732,3.722,15.076z',
            fill:'#F1BC96'
        }));
        
        return { group: group, preScale: preScale };
    };
    
    art.blue = function (group, radius, preScale) {
        group.setScale(radius/25, radius/25);
        preScale = radius/25;
        
        group.add(new Kinetic.Circle({
            radius:25,
            fill: '#6BCAF3'
        }));
        group.add(new Kinetic.Path({
            data: 'M-17.333-2.017c-2.831-2.113-2.046-7.682,11.642-8.066c13.686-0.384,7.756,8.834,3.877,6.722C-5.691-5.474-14.501,0.096-17.333-2.017z',
            fill: '#C5E9FB'
        }));
        group.add(new Kinetic.Path({
            data: 'M-15.878,15.2c-1.02-1.613,0-3.736,12.905,0S-14.861,16.814-15.878,15.2z',
            fill: '#C5E9FB'
        }));
        group.add(new Kinetic.Path({
            data: 'M17.657,6.646c0,2.896-5.801,3.496-8.547,3.496S2.856,7.794,2.856,4.898s2.73-4.208,5.477-4.208S17.657,3.75,17.657,6.646z',
            fill: '#C5E9FB'
        }));
        group.add(new Kinetic.Path({
            data: 'M21.898-11.852C21.898-11.852,21.898-11.852,21.898-11.852L21.898-11.852L21.898-11.852c-0.954-1.759-2.112-3.389-3.444-4.859l-0.002-0.001C18.452-16.712,14.419-9.105,21.898-11.852L21.898-11.852z',
            fill: '#C5E9FB'
        }));
        //console.log(group);
        
        return { group: group, preScale: preScale };
    };
    
    art.fighter = function (group, radius, preScale, color) {
        group.setScale(radius/25, radius/25);
        preScale = radius/25;
        
        group.add(new Kinetic.Path({
            data:'M-5.607,0c0,0,3.357,10.105,5.607,10.105S5.607,0,5.607,0',     //'M-5.607,23.895C-5.607,23.895-2.25,34,0,34s5.607-10.105,5.607-10.105', Old, aligned
            fill:'orange',
            visible:false,
        }));
        group.children[0].attrs.offset.y = -24
        
        group.add(new Kinetic.Path({
            data: 'M3.459-7.583l21.438,25.927c0,0-7.397,0.823-9.331,0c-1.934-0.823-4.761-4.253-4.761-4.253L3.917-2.864',
            fill: color,
            stroke: '#000000',
            strokeWidth: 1// * postScale
        }));
        
        group.add(new Kinetic.Path({
            data: 'M-3.917-2.864l-6.888,16.955c0,0-2.827,3.43-4.761,4.253c-1.934,0.823-9.331,0-9.331,0L-3.731-7.583',
            fill: color,
            stroke: '#000000',
            strokeWidth: 1// * postScale
        }));
        
        group.add(new Kinetic.Path({
            data: 'M3.917-2.864l1.899,19.602L3.917-2.864L2.659-21.319c0,0-0.826-3.577-2.659-3.577s-2.66,3.577-2.66,3.577L-3.917-2.864l-1.9,19.602l1.9-19.602l-6.888,16.955l0,0l4.988,2.647l-0.79,8.157l6.43-1.319l6.784,1.319l-0.791-8.157l4.989-2.647L3.917-2.864z',
            fill: '#A5A4A4',
            stroke: '#000000',
            strokeWidth: 1// * postScale
        }));
        //console.log(group);
        
        return { group: group, preScale: preScale };
    };
    
    art.destination = function(group, radius, preScale, color) {
        group.setScale(radius/25, radius/25);
        preScale = radius/25;
        
        group.add(new Kinetic.Circle({
            radius: 25 + 10,    //The actual radius + radius/2 of the ship to fake having half of the ship in the circle
            fill: '#87CEFA',
            //opacity: 0.4,
            stroke: '#00BFFF',
            strokeWidth: 5,
            strokeOpacity: 1
        }))
        color = '#87CEFA';
        
        return {group: group, preScale: preScale, color: color };
    }
    
    art.ticker = function(group, target) {
        group.add(new Kinetic.Circle({
            text: target,
            x: 10,
            y: 10
            
        }))
        return group;
    }
    
    
    return art;
})