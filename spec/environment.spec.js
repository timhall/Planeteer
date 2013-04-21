define(
['cosmic/environment'],
function (environment) {
    var _spec = this,
        matter = {
            advance: function () {}
        };
    
    describe('Environment', function () {
        beforeEach(function () {
            environment.objects = [];            
        })
        
        describe('add', function () {
            it('should add Matter to objects array', function () {
                expect(environment.objects.length).toEqual(0);
                
                environment.addObject(matter);
                expect(environment.objects.length).toEqual(1);
                
                environment.addObject(matter);
                expect(environment.objects.length).toEqual(2);
            });
        })
        
        describe('Advance', function () {
            it('should advance all matter with timestep', function () {
                var spy = sinon.spy();
                matter.advance = spy;
                
                environment.addObject(matter);
                environment.addObject(matter);
                
                environment.advance(10);
                
                expect(spy).toHaveBeenCalledTwice();
                expect(spy).toHaveBeenCalledWith(10);
            });
            
            it('shouldn\'t blow up when no advance is defined', function () {
                var emptyMatter = {};
                
                environment.addObject(emptyMatter);
                environment.advance(10);
            })
        })
    });
})