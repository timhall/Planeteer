

define(
['freebody', 'underscore', 'art', 'Kinetic', 'cosmic'],
function (freebody, _, art, Kinetic, cosmic) {
    
    //var ui = {}
    
    var ticker = {};
    
    ticker.display(function () {
        var display = new Kinetic.Group()
        
        return art.ticker(display, cosmic.selected)
    })
    
    cosmic.ui.objects.push(ticker)
    
    
    
    
    return ui; 
});