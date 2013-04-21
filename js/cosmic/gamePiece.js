cosmic.gamePiece = (function (Matter, collisions, _, Kinetic) {

    /**
     * Wrapper for "game piece" functionality
     */
    var gamePiece = function () {
        var piece = this;
        
        // Generic GamePiece object that's being created
        var GamePiece = function (options) {
            // Setup options
            this.options = _.defaults(options, GamePiece.defaults);

            // Extend Matter
            Matter.call(this, this.options);
            
            // Create display
            this.display = this._create.call(this);

            // Setup bounding (if specified)
            if (_.isFunction(this._setBounding)) {
                this._setBounding.call(this);    
            }

            // Setup events
            this._setupEvents();

            return this;
        };

        // Extensions
        _.extend(GamePiece.prototype,
            Matter.prototype
        );

        /**
         * Set default options for game piece
         *
         * @param {Object} options
         * @chainable
         */
        piece.defaults = function (options) {
            // Add static defaults to GamePiece
            GamePiece.defaults = options;

            // Return for chaining
            return piece;
        };

        /**
         * Add methods to game piece prototype
         *
         * @param {Object} methods
         * @chainable
         */
        piece.methods = function (methods) {
            // Add methods to prototype
            _.extend(GamePiece.prototype, methods);

            // Return for chaining
            return piece;
        };

        /**
         * Function for creating display of game piece
         *
         * @param {Function} create function that returns display object
         * @chainable
         */
        piece.display = function (create) {
            GamePiece.prototype._create = create;
            return piece;
        };

        /**
         * Events and the functions to respond to them with
         *
         * Example: 
         * .events({ 
         *   'click': function () {...}, 
         *   'remove': 'methodname' 
         * })
         * 
         * @param {Object} events object
         * @chainable
         */
        piece.events = function (events) {
            GamePiece.prototype._setupEvents = function () {
                var self = this;

                _.each(events, function (callback, key) {
                    if (_.isString(callback)) {
                        callback = self[callback];
                    }
                    self.on(key, callback);
                });
            }

            return piece;
        };

        /**
         * Setup collisions on object
         *
         * Example:
         * .collisions('centerDistance', function (bounding) {
         *   bounding(this.options.radius);
         * })
         * 
         * @param {String} strategy
         * @param {Function} bounding function
         * @chainable
         */
        piece.collisions = function (strategy, bounding) {
            // Find collision approach for strategy
            var collision = collisions[strategy];
            if (collision) {
                _.extend(GamePiece.prototype, 
                    collision.methods, {
                    _setBounding: function () {
                        bounding.call(this, collision.setBounding);        
                    }
                });
            }
            return piece;
        };

        /**
         * Construct game piece for later instantiation
         *
         * @return GamePiece object
         */
        piece.construct = function () {
            return GamePiece;
        };

        /**
         * Create an instance of the GamePiece
         *
         * @param {Object} options
         * @return instantiated GamePiece object
         */
        piece.create = function (options) {
            return new piece.construct(options);    
        };

        return piece;
    };

    // Finally, return
    return gamePiece;

})(cosmic.Matter, cosmic.collisions, _, Kinetic);
