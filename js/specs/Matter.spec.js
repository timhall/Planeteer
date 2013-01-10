define(
['cosmic/Matter'],
function (Matter) {
    var _spec = this
    
    describe('Matter', function () {
        it('should inherit Body properties', function () {
            var matter = new Matter();
            expect(typeof matter.advance).toEqual('function');
        });
        
        it('should call create display method', function () {
            var spy = sinon.spy(),
                Obj = Matter;
            
            Obj.prototype.create = spy;
            
            var matter = new Obj();
            expect(spy).toHaveBeenCalled();
        });
    });
});
