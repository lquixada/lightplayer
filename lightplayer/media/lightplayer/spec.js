
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

    // Prevents doing real ajax calls (clears console!)
    spyOn( $, 'ajax' );

    // Prevents css3 animations on open
    spyOn( LightPlayer.prototype, '_animateIn' ).andCallFake( function ( callback ) {
        callback();
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



/***********************************************
 * MODULO BASIC
 ***********************************************/

describe("Module: Basic Module", function() {
    beforeEach(function() {
        this.bus = $( {} );
        this.json = {
            itens: [
                { id: 123, title: 'titulo 1', description: 'desc 1', views: 1000 },
                { id: 456, title: 'titulo 2', description: 'desc 2', views: 2000, current: true },
                { id: 789, title: 'titulo 3', description: 'desc 3', views: 3000 }
            ]
        };

        this.mod = new Mod();
        this.mod.init( this.bus, this.json );
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

            this.mod = new Mod();
            this.mod.init( null, this.json );

            expect( $.isEmptyObject( this.mod._getItem( 'next' ) ) ).toBe( true );
        });

        it("should get the prev item", function () {
            expect( this.mod._getItem( 'prev' ) ).toBe( this.json.itens[0] );
        });

        it("should get the prev item as null if current is first", function() {
            this.json.itens[1].current = false;
            this.json.itens[0].current = true;

            this.mod = new Mod();
            this.mod.init( null, this.json );

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
        it("should subscribe to an event", function() {
            var callback = jasmine.createSpy();

            this.mod.sub( 'some-event', callback );

            this.mod.bus.trigger( 'some-event' );

            expect( callback ).toHaveBeenCalled();
        }); 
    });

});



/***********************************************
 * MODULO HEADER
 ***********************************************/

describe("Module: Header", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            itens: [
                { id: 123, title: 'titulo 1' },
                { id: 456, title: 'titulo 2' },
                { id: 789, title: 'titulo 3' }
            ]
        };

        this.header = new Header();
        this.header.init( this.bus, this.json );
    });
    
    it("should have a name", function() {
        this.header.init( this.bus, this.json );

        expect( this.header.name ).toBe( 'header' );
    });

    it("should have a default title", function() {
        expect( this.header.domRoot.find( 'h5' ).html() ).toBe( '<span>mais</span> videos' );
    });

    it("should not have a default subtitle", function() {
        expect( this.header.domRoot.find( 'em.subtitulo' ).text() ).toBe( '' );
    });

    it("show customize the lightbox title", function() {
        this.json.title = 'ultimos videos da semana';

        this.header = new Header();
        this.header.init( this.bus, this.json );

        expect( this.header.domRoot.find( 'h5' ).text() ).toBe( this.json.title );
    });
    
    it("should show the lightbox subtitle", function() {
        this.json.subtitle = 'melhores videos do mesmo tema';

        this.header = new Header();
        this.header.init( this.bus, this.json );

        expect( this.header.domRoot.find( 'em.subtitulo' ).text() ).toBe( this.json.subtitle );
    });

    it("should show the close button", function() {
        expect( this.header.domRoot.find( 'a.close' ).size() ).toBe( 1 );
    });

    it("should close when close button clicked", function() {
        var callback = jasmine.createSpy( 'lightplayer-close-callback' );
        
        this.header.bus.bind( 'lightplayer-close', callback );
        this.header.domRoot.find( 'a.close' ).click();
        
        expect( callback ).toHaveBeenCalled();
    });
    
});



/***********************************************
 * MODULO STAGE
 ***********************************************/

describe("Module: Stage", function() {
    beforeEach(function() {
        this.bus = $( {} );
        this.json = {
            itens: [
                { id: 123, title: 'titulo 1' },
                { id: 456, title: 'titulo 2' },
                { id: 789, title: 'titulo 3' }
            ]
        };

        this.stage = new Stage();
    });

    describe("no item as current", function() {
        // TODO
    });

    it("should have a name", function() {
        this.stage.init( this.bus, this.json );

        expect( this.stage.name ).toBe( 'stage' );
    });

    describe("first item", function() {
        beforeEach(function() {
            this.json.itens[0].current = true;

            this.stage.init( this.bus, this.json );

            this.liCurrent = this.stage.domRoot.find( 'ul li.current' );
        });
        
        it("should render", function() {
            expect( this.liCurrent.size() ).toBe( 1 );
            expect( this.liCurrent.attr( 'id' ) ).toBe( 'item-123' );
        });

        it("should have a video player div", function() {
            expect( this.liCurrent.find( 'div.video-player' ).size() ).toBe( 1 );
        });
    });

    describe("second item", function() {
        beforeEach(function() {
            this.json.itens[1].current = true;

            this.stage.init( this.bus, this.json );

            this.liCurrent = this.stage.domRoot.find( 'ul li.current' );
        });
        
        it("should render", function() {
            expect( this.liCurrent.size() ).toBe( 1 );
            expect( this.liCurrent.attr( 'id' ) ).toBe( 'item-456' );
        });

        it("should have a video player div", function() {
            expect( this.liCurrent.find( 'div.video-player' ).size() ).toBe( 1 );
        });
    });


    describe("player", function() {
        beforeEach(function() {
            this.json.itens[0].current = true;

            this.stage.init( this.bus, this.json );

            this.liCurrent = this.stage.domRoot.find( 'ul li.current' );
        });

        it("should call player", function() {
            expect( $.fn.player ).toHaveBeenCalled();
        });

        it("should call player with the current item id", function() {
            expect( this.playerParams.videosIDs ).toBe( this.json.itens[0].id );
        });
        
        it("should show the player with the right width", function() {
            var div = this.stage.domRoot.find( 'li.current div.video-player' );

            expect( this.playerParams.width ).toBe( 640 );
            expect( div.attr( 'style' ) ).toMatch( /640px/ );
        });

        it("should adapt the player width on sd mode", function() {
            var div;

            this.json.mode = 'sd';

            this.stage.init( this.bus, this.json );

            div = this.stage.domRoot.find( 'li.current div.video-player' );

            expect( this.playerParams.width ).toBe( 480 );
            expect( div.attr( 'style' ) ).toMatch( /480px/ );
        });
        
        it("should show the player with the right height", function() {
            expect( this.playerParams.height ).toBe( 360 );
        });

        it("should use a blank sitepage", function() {
            expect( this.playerParams.sitePage ).toBe( '' );
        });

        it("should configure the sitepage", function() {
            this.json.sitePage = 'exemplo/de/sitepage';
            this.stage.init( this.bus, this.json );

            expect( this.playerParams.sitePage ).toBe( this.json.sitePage );
        });
        
        it("should not enable autoPlay", function() {
            expect( this.playerParams.autoPlay ).toBe( false );
        });

        it("should configure the autoPlay", function() {
            this.json.autoPlay = true;

            this.stage.init( this.bus, this.json );

            expect( this.playerParams.autoPlay ).toBe( true );
        });
        
        it("should not enable autoNext", function() {
            spyOn( this.stage, '_goNext' );

            this.playerParams.complete();

            expect( this.stage._goNext ).not.toHaveBeenCalled();
        });

        it("should enable autoNext", function() {
            this.json.autoNext = true;
            
            this.stage.init( this.bus, this.json );

            spyOn( this.stage, '_goNext' );

            this.playerParams.complete();

            expect( this.stage._goNext ).toHaveBeenCalled();
        });
    });

    describe("arrows", function() {
        beforeEach(function() {
            this.json.itens[1].current = true;

            this.stage.init( this.bus, this.json );
        });

        describe("NEXT button", function() {
            beforeEach(function() {
                this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
            });
            
            it("should exist", function() {
                expect( this.nextButton.size() ).toBe( 1 );
            });

            it("should have an arrow", function() {
                expect( this.nextButton.find( 'span.arrow' ).size() ).toBe( 1 );
            });

            it("should have an chapeu", function() {
                expect( this.nextButton.find( 'span.chapeu' ).text() ).toBe( 'Próximo' );
            });
        });

        describe("PREV button", function() {
            beforeEach(function() {
                this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
            });
            
            it("should exist", function() {
                expect( this.prevButton.size() ).toBe( 1 );
            });

            it("should have an arrow", function() {
                expect( this.prevButton.find( 'span.arrow' ).size() ).toBe( 1 );
            });

            it("should have an chapeu", function() {
                expect( this.prevButton.find( 'span.chapeu' ).text() ).toBe( 'Anterior' );
            });
        });
    });

    describe("scenarios", function() {
        
        describe("beginning", function() {
            beforeEach(function() {
                this.json.itens[0].current = true;

                this.stage.init( this.bus, this.json );

                this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
                this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
            });
            
            it("should have the PREV button not visible", function () {
                expect( this.prevButton ).not.toHaveClass( 'visible' );
            });

            it("should have the PREV button with no title", function () {
                expect( this.prevButton.find( 'span.titulo' ).text() ).toBe( '' );
            });

            it("should have the NEXT button visible", function () {
                expect( this.nextButton ).toHaveClass( 'visible' );
            });
            
            it("should have the NEXT button with the next item title", function () {
                var nextTitle = this.json.itens[1].title;
                expect( this.nextButton.find( 'span.titulo' ).text() ).toBe( nextTitle );
            });
        });

        describe("middle", function() {
            beforeEach(function() {
                this.json.itens[1].current = true;

                this.stage.init( this.bus, this.json );

                this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
                this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
            });
            
            it("should have the PREV button visible", function () {
                expect( this.prevButton ).toHaveClass( 'visible' );
            });

            it("should have the PREV button with the previous item title", function () {
                var prevTitle = this.json.itens[0].title;
                expect( this.prevButton.find( 'span.titulo' ).text() ).toBe( prevTitle );
            });

            it("should have the NEXT button visible", function () {
                expect( this.nextButton ).toHaveClass( 'visible' );
            });

            it("should have the NEXT button with the next item title", function () {
                var nextTitle = this.json.itens[2].title;
                expect( this.nextButton.find( 'span.titulo' ).text() ).toBe( nextTitle );
            });
        });

        describe("end", function() {
            beforeEach(function() {
                this.json.itens[2].current = true;

                this.stage.init( this.bus, this.json );

                this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
                this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
            });
            
            it("should have the PREV button visible", function () {
                expect( this.prevButton ).toHaveClass( 'visible' );
            });

            it("should have the PREV button with the prev item title", function () {
                var prevTitle = this.json.itens[1].title;
                expect( this.prevButton.find( 'span.titulo' ).text() ).toBe( prevTitle );
            });

            it("should have the NEXT button not visible", function () {
                expect( this.nextButton ).not.toHaveClass( 'visible' );
            });
            
            it("should have the NEXT button with no title", function () {
                expect( this.nextButton.find( 'span.titulo' ).text() ).toBe( '' );
            });
        }); 
    }); // describe("scenarios")

    describe("interaction", function() {
        beforeEach(function() {
            this.json.itens[1].current = true;
            
            this.stage.init( this.bus, this.json );

            this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
            this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
        });

        describe("NEXT button", function() {
            beforeEach(function() {
                var that = this;

                $.fn.player = $.fn.player.originalValue;
                
                spyOn( $.fn, 'player' ).andCallFake( function ( params ) {
                    that.playerParams = params;
                });

                this.nextButton.click();
            });
            
            it("should move to the next item", function() {
                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-789' );
            });

            it("should update json", function() {
                expect( this.stage.json.itens[2].current ).toBe( true );
            });

            it("should not be visible", function() {
                expect( this.nextButton ).not.toHaveClass( 'visible' );
            });

            it("should call player", function() {
                expect( $.fn.player ).toHaveBeenCalled();
            });

            it("should call player with the current item id", function() {
                expect( this.playerParams.videosIDs ).toBe( this.json.itens[2].id );
            });

            it("should trigger video-change from it", function() {
                var event, callback;

                callback = jasmine.createSpy( 'video-change-callback' ).andCallFake( function ( evt ) {
                    event = evt;
                } );
                
                this.stage.init( this.bus, this.json );
                this.stage.bus.bind( 'video-change', callback );

                this.nextButton.click();

                expect( event.origin ).toBe( 'stage' );
            });
        });
        

        describe("PREV button", function() {
            beforeEach(function() {
                this.prevButton.click();
            });
            
            it("should move to the prev item", function() {
                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-123' );
            });

            it("should update json", function() {
                expect( this.stage.json.itens[0].current ).toBe( true );
            });

            it("should not be visible", function() {
                expect( this.prevButton ).not.toHaveClass( 'visible' );
            });

            it("should call player", function() {
                expect( $.fn.player ).toHaveBeenCalled();
            });

            it("should call player with the current item id", function() {
                expect( this.playerParams.videosIDs ).toBe( this.json.itens[0].id );
            });

            it("should trigger video-change from it", function() {
                var event, callback;

                callback = jasmine.createSpy( 'video-change-callback' ).andCallFake( function ( evt ) {
                    event = evt;
                } );
                
                this.stage.init( this.bus, this.json );
                this.stage.bus.bind( 'video-change', callback );

                this.prevButton.click();

                expect( event.origin ).toBe( 'stage' );
            });
        });

        describe("Keyboard shortcuts", function() {
            it("should go to the next item with Right key", function() {
                var evt = $.Event( 'keydown' );
                evt.which = 39;
                
                $( document ).trigger( evt );

                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-789' );
            });

            it("should go to the next item with Left key", function() {
                var evt = $.Event( 'keydown' );
                evt.which = 37;
                
                $( document ).trigger( evt );

                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-123' );
            });
        });

        describe("Events", function() {
            it("should change on video-change", function() {
                this.json.itens[1].current = false;
                this.json.itens[2].current = true;
                
                this.bus.trigger( { type:'video-change', origin: 'testsuite', json: this.json } );
                
                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-789' );
            });


            it("should not change on video-change from same source", function() {
                this.json.itens[1].current = false;
                this.json.itens[2].current = true;
                
                this.bus.trigger( { type:'video-change', origin: 'stage' } );
                
                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-456' );
            });
        });
    }); // describe( "interaction" )
    
});



/***********************************************
 * MODULO INFO
 ***********************************************/

describe("Module: Info", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            itens: [
                { id: 123, title: 'titulo 1', description: 'desc 1', views: 1000 },
                { id: 456, title: 'titulo 2', description: 'desc 2', views: 2000, current: true },
                { id: 789, title: 'titulo 3', description: 'desc 3', views: 3000 }
            ]
        };

        this.info = new Info();
        this.info.init( this.bus, this.json );
    });

    it("should have a name", function() {
        this.info.init( this.bus, this.json );

        expect( this.info.name ).toBe( 'info' );
    });
    
    it("should have a default title", function() {
        expect( this.info.domRoot.find( 'h6' ).html() ).toBe( this.json.itens[1].title );
    });

    it("should have a description", function() {
        expect( this.info.domRoot.find( 'p' ).text() ).toBe( this.json.itens[1].description );
    });

    it("should have views count", function() {
        expect( this.info.domRoot.find( 'span.views' ).text() ).toBe( this.json.itens[1].views+' exibições' );
    });

    it("should update on new current item", function() {
        var div = this.info.domRoot,
            current = this.json.itens[2];
        
        this.json.itens[1].current = false;
        this.json.itens[2].current = true;

        this.bus.trigger( { type: 'video-change', json: this.json } );
        
        expect( div.find( 'h6' ).text() ).toBe( current.title );
        expect( div.find( 'p' ).text() ).toBe( current.description );
        expect( div.find( 'span.views' ).text() ).toBe( current.views+' exibições' );
    });
    
});



/***********************************************
 * MODULO SOCIAL
 ***********************************************/

describe("Module: Social", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            itens: [
                {
                    id: 123,
                    title: 'titulo 1',
                    description: 'desc 1',
                    views: 1000,
                    url: 'http://www.globo.com/slug/item-1/',
                    shortUrl: 'http://glo.bo/11111',
                    thumbUrl: 'thumb.jpg',
                    current: true
                },
                    {
                    id: 456,
                    title: 'titulo 2',
                    description: 'desc 2',
                    views: 2000,
                    url: 'http://www.globo.com/slug/item-2/',
                    shortUrl: 'http://glo.bo/22222',
                    thumbUrl: 'thumb2.jpg'
                },
                {
                    id: 789,
                    title: 'titulo 3',
                    description: 'desc 3',
                    views: 3000,
                    url: 'http://www.globo.com/slug/item-3/',
                    thumbUrl: 'thumb3.jpg'
                }
            ]
        };

        this.social = new Social();
        this.social.init( this.bus, this.json );
    });

    it("should have a name", function() {
        this.social.init( this.bus, this.json );

        expect( this.social.name ).toBe( 'social' );
    });

    it("should have a container", function() {
        expect( this.social.domRoot.size() ).toBe( 1 );
        expect( this.social.domRoot ).toHaveClass( 'social' );
    });
    
    describe("twitter", function() {
        it("should have a twitter share button", function() {
            expect( this.social.domRoot.find( 'a.twitter.button' ).size() ).toBe( 1 );
        });

        it("should have a twitter share button with shorten url", function() {
            var encodedUrl = encodeURIComponent( this.json.itens[0].shortUrl );
            expect( this.social.domRoot.find( 'a.twitter.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should use the regular url if shorten url is not provided", function() {
            var encodedUrl;
            
            delete this.json.itens[0].shortUrl;

            this.social = new Social();
            this.social.init( this.bus, this.json ); 

            encodedUrl = encodeURIComponent( this.json.itens[0].url );

            expect( this.social.domRoot.find( 'a.twitter.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should have a twitter share button with title", function() {
            var encodedTitle = encodeURIComponent( this.json.itens[0].title );

            expect( this.social.domRoot.find( 'a.twitter.button' ).attr( 'href' ) ).toContain( encodedTitle );
        });

    });
   
    describe("facebook", function() {
        it("should have facebook likes", function() {
            expect( this.social.domRoot.find( 'span.facebook > :first-child' ).size() ).toBe( 1 );
        });

        it("should use the regular url for the facebook like", function() {
            expect( this.social.domRoot.find( 'span.facebook > :first-child' ).attr( 'href' ) ).toContain( this.json.itens[0].url );
        });

        it("should have a facebook share button", function() {
            expect( this.social.domRoot.find( 'a.facebook.button' ).size() ).toBe( 1 );
        });

        it("should have a facebook share button with shorten url", function() {
            var encodedUrl = encodeURIComponent( this.json.itens[0].shortUrl );
            expect( this.social.domRoot.find( 'a.facebook.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should use the regular url if shorten url is not provided", function() {
            var encodedUrl;
            
            delete this.json.itens[0].shortUrl;

            encodedUrl = encodeURIComponent( this.json.itens[0].url );

            this.social = new Social();
            this.social.init( this.bus, this.json ); 

            expect( this.social.domRoot.find( 'a.facebook.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });
        
        it("should have a facebook share button with title", function() {
            var encodedTitle = encodeURIComponent( this.json.itens[0].title );

            expect( this.social.domRoot.find( 'a.facebook.button' ).attr( 'href' ) ).toContain( encodedTitle );
        });
    });

    describe("orkut", function() {
        it("should have an orkut share button", function() {
            expect( this.social.domRoot.find( 'a.orkut.button' ).size() ).toBe( 1 );
        });

        it("should have a orkut share button with shorten url", function() {
            var encodedUrl = encodeURIComponent( this.json.itens[0].shortUrl );
            expect( this.social.domRoot.find( 'a.orkut.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should use the regular url if shorten url is not provided", function() {
            var encodedUrl;

            delete this.json.itens[0].shortUrl;

            encodedUrl = encodeURIComponent( this.json.itens[0].url );

            this.social = new Social();
            this.social.init( this.bus, this.json ); 

            expect( this.social.domRoot.find( 'a.orkut.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should have an orkut share button with title", function() {
            expect( this.social.domRoot.find( 'a.orkut.button' ).attr( 'href' ) ).toContain( encodeURI( this.json.itens[0].title ) );
        });

        it("should have an orkut share button with thumb url", function() {
            expect( this.social.domRoot.find( 'a.orkut.button' ).attr( 'href' ) ).toContain( this.json.itens[0].thumbUrl );
        });
    });

    describe("glo.bo", function() {
        it("should have a field for shortened url", function() {
            expect( this.social.domRoot.find( 'input.globo-url' ).size() ).toBe( 1 );
        });

        it("should display the shortened version of url", function() {
            expect( this.social.domRoot.find( 'input.globo-url' ).val() ).toContain( this.json.itens[0].shortUrl );
        });

        it("should not display a field for shortened url when there isn't one", function() {
            delete this.json.itens[0].shortUrl;

            this.social = new Social();
            this.social.init( this.bus, this.json );  

            expect( this.social.domRoot.find( 'input.globo-url' ).size() ).toBe( 0 );
        });
    });

    describe("Events", function() {
        beforeEach(function() {
            this.json.itens[0].current = false;
            this.json.itens[2].current = true;
            
            this.bus.trigger( { type:'video-change', origin: 'testsuite', json: this.json } );
        });
        
        it("should change twitter button url on video-change", function() {
            var encodedUrl = encodeURIComponent( this.json.itens[2].url );
            expect( this.social.domRoot.find( 'a.twitter.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should change facebook button url on video-change", function() {
            var encodedUrl = encodeURIComponent( this.json.itens[2].url );
            expect( this.social.domRoot.find( 'a.facebook.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });

        it("should change facebook xml url on video-change", function() {
            expect( this.social.domRoot.find( 'span.facebook > :first-child' ).attr( 'href' ) ).toContain( this.json.itens[2].url );
        });

        it("should change orkut button url on video-change", function() {
            var encodedUrl = encodeURIComponent( this.json.itens[2].url );
            expect( this.social.domRoot.find( 'a.orkut.button' ).attr( 'href' ) ).toContain( encodedUrl );
        });
    });
});

