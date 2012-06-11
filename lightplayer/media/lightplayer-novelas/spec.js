
beforeEach(function() {
    var that = this;

    // Prevents jquery animations
    $.fx.off = true;

    // Prevents embedding flash player (speeds up the tests!)
    spyOn( $.fn, 'player' ).andCallFake( function ( params ) {
        that.playerParams = params;
    });
    
    // Prevents dealing with Facebook SDK
    window.facebookParse = function () {};

    // Prevents css3 animations on open
    spyOn( LightPlayerNovelas.prototype, '_animateIn' ).andCallFake( function ( callback ) {
        callback();
    });

    // Prevents css3 animations on close
    spyOn( LightPlayerNovelas.prototype, '_animateOut' ).andCallFake( function ( callback ) {
        callback();
    });

    this.addMatchers({
        toHaveClass: function( klass ) {
             if ( klass ) {
                 return this.actual.hasClass( klass ) === true;
             } else {
                 return this.actual.attr( 'class' ) !== '';
             }
         }
    });
});

afterEach(function() { 
    $.fx.off = false;
});

describe("LightPlayer Novelas", function() {
    beforeEach(function() {
        this.lightplayer = new LightPlayerNovelas();
    });
    
    it("should instantiate", function() {
        expect( typeof this.lightplayer ).toBe( 'object' );
    });

    it("should inherit from LightPlayer", function() {
        expect( typeof this.lightplayer.open ).toBe( 'function' );
    });
    
});

