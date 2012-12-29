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
                
                environment.add(matter);
                expect(environment.objects.length).toEqual(1);
                
                environment.add(matter);
                expect(environment.objects.length).toEqual(2);
            });
        })
        
        describe('Advance', function () {
            it('should advance all matter with timestep', function () {
                var spy = sinon.spy();
                matter.advance = spy;
                
                environment.add(matter);
                environment.add(matter);
                
                environment.advance(10);
                
                expect(spy).toHaveBeenCalledTwice();
                expect(spy).toHaveBeenCalledWith(10);
            });
            
            it('shouldn\'t blow up when no advance is defined', function () {
                var emptyMatter = {};
                
                environment.add(emptyMatter);
                environment.advance(10);
            })
        })
    });
})