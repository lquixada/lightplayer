
beforeEach(function() {
    var that = this;

    // Prevents jquery animations
    $.fx.off = true;

    // Prevents embedding flash player (speeds up the tests!)
    spyOn( $.fn, 'player' ).andCallFake( function ( params ) {
        that.playerParams = params;
    });

    // Prevents css3 animations on open
    spyOn( LightPlayer.prototype, '_animateIn' ).andCallFake( function ( callback ) {
        if (callback) {
					callback();
				}
    });

    // Prevents css3 animations on close
    spyOn( LightPlayer.prototype, '_animateOut' ).andCallFake( function ( callback ) {
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

    this.lightplayer = new LightPlayer();
});


afterEach(function() { 
    $.fx.off = false;

    this.playerParams = null;

    $( 'div.lightplayer' ).remove();
    $( document ).unbind();
});


describe("Light Player", function() {
    beforeEach(function() {
        this.json = {
            itens: [
                {
                    id: 123,
                    title: 'Titulo 1',
                    description: 'Descricao 1',
                    views: '100',
                    url: 'http://www.globo.com',
                    current: true
                }
            ]
        };
        
        this.lightplayer.open( this.json );
    });

    describe("open", function() {
        it("should have a container", function() {
            expect( this.lightplayer.domRoot.size() ).toBe( 1 );
        });

        it("should have a box", function() {
            expect( this.lightplayer.domRoot.find( 'div.widget' ).size() ).toBe( 1 );
        });

        it("should have an overlay", function() {
            expect( this.lightplayer.domRoot.find( 'div.widget-overlay' ).size() ).toBe( 1 );
        });

        it("should set the html class", function() {
            this.json = {
                htmlClass: 'blah',
                itens: [
                    {
                        id: 123,
                        title: 'Titulo 1',
                        description: 'Descricao 1',
                        views: '100',
                        url: 'http://www.globo.com',
                        current: true
                    }
                ]
            };
            
            this.lightplayer.open( this.json );
            
            expect( this.lightplayer.domRoot ).toHaveClass( 'blah' );
        });

    });

    describe("close", function() {
        beforeEach(function() {
            this.simulateEscKey = function () {
                var evt = jQuery.Event('keydown');
                evt.which = 27;
                $( document ).trigger( evt );
            };
        });

        it("should close", function() {
            this.lightplayer.close();

            expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        });

        it("should close on Esc key", function() {
            this.simulateEscKey();

            expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        });

        it("should dettach Esc key event from document", function() {
            expect( $( document ).data( 'events' ) ).toBeDefined();

            this.simulateEscKey();

            expect( $( document ).data( 'events' ) ).not.toBeDefined();
        });

        it("should close clicking on overlay (container)", function() {
            this.lightplayer.domRoot.find( 'div.widget-container' ).click();
            
            expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        });

        it("should close on close event", function() {
            this.lightplayer.bus.trigger( 'lightplayer-close' );
            
            expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        });
        
    });
    
    describe("module", function() {
        it("should add a stage as module", function() {
            expect( this.lightplayer.domRoot.find( 'div.widget' ).find( 'div.palco' ).size() ).toBe( 1 );
        });

        it("should add a header as module", function() {
            expect( this.lightplayer.domRoot.find( 'div.widget' ).find( 'div.header' ).size() ).toBe( 1 );
        });

        it("should add a title as module", function() {
            expect( this.lightplayer.domRoot.find( 'div.widget' ).find( 'div.info' ).size() ).toBe( 1 );
        });
        
        it("should add a social as module", function() {
            expect( this.lightplayer.domRoot.find( 'div.widget' ).find( 'div.social' ).size() ).toBe( 1 );
        });
    });

});


describe("jQuery interface", function() {
    
    it("should open the lightplayer", function() {
        $.lightplayer.open( {
            itens: [
                {
                    id: 123,
                    title: 'Titulo 1',
                    description: 'Descricao 1',
                    views: '100',
                    url: 'http://www.globo.com',
                    current: true
                }
            ]
        } );

        expect( $( 'div.lightplayer' ).size() ).toBe( 1 );
    });
    
    it("should close the lightplayer", function() {
        $.lightplayer.open( {
            itens: [
                {
                    id: 123,
                    title: 'Titulo 1',
                    description: 'Descricao 1',
                    views: '100',
                    url: 'http://www.globo.com',
                    current: true
                }
            ]
        } );

        $.lightplayer.close();

        expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        
    });
    
});


/***********************************************
 * MODULO MOD
 ***********************************************/

describe("Module: Mod", function() {
    beforeEach(function() {
        this.bus = $( {} );
        this.json = {
            itens: [
                { id: 123, title: 'titulo 1', description: 'desc 1', views: 1000 },
                { id: 456, title: 'titulo 2', description: 'desc 2', views: 2000, current: true },
                { id: 789, title: 'titulo 3', description: 'desc 3', views: 3000 }
            ]
        };

        this.mod = new Mod( this.bus, this.json );
    });

    it("should have a name", function() {
        expect( this.mod.name ).toBe( 'mod-name' );
    });
    
    it("should have a json with a list", function() {
        expect( this.mod.json ).toBe( this.json );
        expect( this.mod.json.itens ).toBe( this.json.itens );
    });

    describe("getItem", function() {
        it("should get the current item", function() {
            expect( this.mod._getItem( 'current' ) ).toBe( this.json.itens[1] );
        });
        
        it("should get the next item", function() {
            expect( this.mod._getItem( 'next' ) ).toBe( this.json.itens[2] );
        });
        
        it("should get the next item as null if current is last", function() {
            this.json.itens[1].current = false;
            this.json.itens[2].current = true;

            this.mod = new Mod( null, this.json );

            expect( $.isEmptyObject( this.mod._getItem( 'next' ) ) ).toBe( true );
        });

        it("should get the prev item", function () {
            expect( this.mod._getItem( 'prev' ) ).toBe( this.json.itens[0] );
        });

        it("should get the prev item as null if current is first", function() {
            this.json.itens[1].current = false;
            this.json.itens[0].current = true;

            this.mod = new Mod( null, this.json );

            expect( $.isEmptyObject( this.mod._getItem( 'prev' ) ) ).toBe( true );
        });
    });

    describe("setItemAsCurrent", function() {
        it("should mark new item as current", function() {
            this.mod._setItemAsCurrent( this.json.itens[2] );

            expect( this.json.itens[2].current ).toBe( true );
        });
        
        it("should unmark all the remaining itens as not current", function() {
            this.mod._setItemAsCurrent( this.json.itens[2] );

            expect( this.json.itens[0].current ).toBeFalsy();
            expect( this.json.itens[1].current ).toBeFalsy();
        });
    });

    describe("pub", function() {
        it("should publish an event", function() {
            var callback = jasmine.createSpy();

            this.mod.bus.bind( 'some-event', callback );

            this.mod.pub( 'some-event' );

            expect( callback ).toHaveBeenCalled();
        });

        it("should publish a json copy", function() {
            var event;
            
            this.mod.bus.bind( 'some-event', function ( evt ) {
                event = evt;
            } );

            this.mod.pub( 'some-event', this.json );

            expect( JSON.stringify(event.json) ).toBe( JSON.stringify(this.mod.json) );
            expect( event.json ).not.toBe( this.mod.json );
        });

        it("should indicate the event publisher", function() {
            var event;
            
            this.mod.bus.bind( 'some-event', function ( evt ) {
                event = evt;
            } );

            this.mod.pub( 'some-event', {} );

            expect( event.origin ).toBe( this.mod.name );
        });
    });

    describe("sub", function () {
        beforeEach(function() {
            this.callback = jasmine.createSpy();
        });
        
        it("should subscribe to an event", function() {
            this.mod.sub( 'some-event', this.callback );

            this.mod.bus.trigger( 'some-event' );

            expect( this.callback ).toHaveBeenCalled();
        }); 

        it("should not execute callback if published from itself", function() {
            this.mod.sub( 'some-event', this.callback );

            this.mod.bus.trigger( {
                type: 'some-event',
                origin: this.mod.name
            } );

            expect( this.callback ).not.toHaveBeenCalled();
        });

        it("should execute callback if not published from itself", function() {
            this.mod.sub( 'some-event', this.callback );

            this.mod.bus.trigger( {
                type: 'some-event',
                origin: 'test-suite'
            } );

            expect( this.callback ).toHaveBeenCalled();
        });
        
    });
});



