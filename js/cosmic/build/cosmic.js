var cosmic = (function(global, _, Backbone, undefined){
    "use strict";

    // Define and export the freebody namespace
    var cosmic = {};

    // Add events
    cosmic.hub = Backbone.Events;
    
// @include ../environment.js
// @include ../CameraBase.js
// @include ../collisions.js
// @include ../Matter.js
// @include ../gamePiece.js
// @include ../KineticCamera.js
// @include ../playback.js

    return cosmic;
})(this || window, _, Backbone);