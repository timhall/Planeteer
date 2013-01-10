define(
['freebody/utils', 'freebody/Vector', 'freebody/Body', 'freebody/gravity'],
function (utils, Vector, Body, gravity) {
    var freebody = {
        utils: utils,
        Vector: Vector,
        Body: Body,
        gravity: gravity,
    };
    
    return freebody;
})