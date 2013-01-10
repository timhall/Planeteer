define(
['cosmic/collisions', 'cosmic/Matter', 'underscore'],
function (collisions, Matter, _) {
    var _spec = this;
        
    var TestObject = function () {
        Matter.call(this);
        return this;
    };
    TestObject.prototype = Matter.prototype;
    
    describe('Collisions', function () {
        it('should have collision call in Matter that uses checkCollision', function () {
            var spy = sinon.spy();
            
            TestObject.prototype.checkCollision = spy;
            var test = new TestObject();
            
            expect(typeof test.collision).toEqual('function');
            test.collision();
            expect(spy).toHaveBeenCalled();
        });
        
        it('should call collide on both objects on collision', function () {
            var spyMatter = sinon.spy(),
                spyObj = sinon.spy();
            
            TestObject.prototype.checkCollision = function () { return true; };
            
            var matter = new TestObject(),
                obj = new TestObject();
            
            matter.collide = spyMatter;
            obj.collide = spyObj;
            
            expect(matter.collision(obj)).toEqual(true);
            expect(spyMatter).toHaveBeenCalled();
            expect(spyObj).toHaveBeenCalled();
        })
        
        describe('Center distance collision', function () {
            it('should be true when distance is within radii', function () {
                var matter = new Matter(),
                    obj = new Matter();
                
                matter.x = 0;
                matter.y = 0;
                collisions.utils.bounding(matter, { radius: 100 });
                
                obj.x = 100;
                obj.y = 0;
                collisions.utils.bounding(obj, { radius: 100 });
            
                expect(collisions.centerDistance.checkCollision.call(matter, obj)).toEqual(true);
            });
            
            it('should be false when distance is outside radii', function () {
                var matter = new Matter(),
                    obj = new Matter();
                
                matter.x = 0;
                matter.y = 0;
                collisions.utils.bounding(matter, { radius: 10 });
                
                obj.x = 100;
                obj.y = 0;
                collisions.utils.bounding(obj, { radius: 10 });
            
                expect(collisions.centerDistance.checkCollision.call(matter, obj)).toEqual(false);
            });
            
            it('should be true when distance is equal to radii', function () {
                var matter = new Matter(),
                    obj = new Matter();
                
                matter.x = 0;
                matter.y = 0;
                collisions.utils.bounding(matter, { radius: 50 });
                
                obj.x = 100;
                obj.y = 0;
                collisions.utils.bounding(obj, { radius: 50 });
            
                expect(collisions.centerDistance.checkCollision.call(matter, obj)).toEqual(true);
            });
        });
        
        describe('Bounding box collision', function () {
            it('should create bounding box from given parameters', function () {
                var matter = new Matter();
                
                // Get bounding box
                var box = collisions.utils.boundingBox(matter, 10, 10, 5, 0);
                
                expect(box.length).toEqual(4);
                expect(box[0].x).toBeCloseTo(5);
                expect(box[0].y).toBeCloseTo(-5);
                
                expect(box[1].x).toBeCloseTo(-5);
                expect(box[1].y).toBeCloseTo(-5);
                
                expect(box[2].x).toBeCloseTo(-5);
                expect(box[2].y).toBeCloseTo(5);
                
                expect(box[3].x).toBeCloseTo(5);
                expect(box[3].y).toBeCloseTo(5);
            });
            
            it('should set radius when bounding box is set', function () {
                var matter = new Matter;
                
                // Set bounding box
                collisions.utils.boundingBox(matter, 5, 20, 5, 0);
                
                expect(collisions.utils.bounding(matter).radius).toBeCloseTo(Math.sqrt(15*15 + 2.5*2.5),2);
            });
            
            it('should be true when point is inside box', function () {
                var matter = new Matter(),
                    obj = new Matter();
                
                matter.x = 0;
                matter.y = 0;
                collisions.utils.boundingBox(matter, 10, 10, 5, 0);
                
                obj.x = 0;
                obj.y = 0;
                collisions.utils.boundingBox(obj, 5, 5, 2.5, 0);
            
                expect(collisions.boundingBox.checkCollision.call(matter, obj)).toEqual(true);
            });
            
            it('should be false when point is outside box', function () {
                var matter = new Matter(),
                    obj = new Matter();
                
                matter.x = 100;
                matter.y = 0;
                collisions.utils.boundingBox(matter, 10, 10, 5, 0);
                
                obj.x = 0;
                obj.y = 0;
                collisions.utils.boundingBox(obj, 5, 5, 2.5, 0);
            
                expect(collisions.boundingBox.checkCollision.call(matter, obj)).toEqual(false);
            });
            
            it('should be true when point is touching box', function () {
                var matter = new Matter(),
                    obj = new Matter();
                
                matter.x = 0;
                matter.y = 0;
                collisions.utils.boundingBox(matter, 10, 10, 5, 0);
                
                obj.x = 0;
                obj.y = 0;
                collisions.utils.boundingBox(obj, 10, 10, 5, 0);
            
                expect(collisions.boundingBox.checkCollision.call(matter, obj)).toEqual(true);
            });
        });
    });
})