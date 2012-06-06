
beforeEach(function() {
    var that = this;

    // Prevents jquery animations
    $.fx.off = true;

    // Prevents embedding flash player (speeds up the tests!)
    spyOn( $.fn, 'player' ).andCallFake( function ( params ) {
        that.playerParams = params;
    });
    
    // Prevents calling tipTip plugin
    $.fn.tipTip = function () {};
    
    // Prevents dealing with Facebook SDK
    window.facebookParse = function () {};

    // Prevents doing real ajax calls (clears console!)
    spyOn( $, 'ajax' );

    // Prevents setTimout async call
    spyOn( window, 'setTimeout' ).andCallFake( function ( callback ) {
        callback();
    });

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
            list: [
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
            expect( this.lightplayer.div.size() ).toBe( 1 );
        });

        it("should have a box", function() {
            expect( this.lightplayer.div.find( 'div.widget' ).size() ).toBe( 1 );
        });

        it("should have an overlay", function() {
            expect( this.lightplayer.div.find( 'div.widget-overlay' ).size() ).toBe( 1 );
        });

        it("should set the html class", function() {
            this.json = {
                htmlClass: 'blah',
                list: [
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
            
            expect( this.lightplayer.div ).toHaveClass( 'blah' );
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
            this.lightplayer.div.find( 'div.widget-container' ).click();
            
            expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        });

        it("should close on close event", function() {
            this.lightplayer.bus.trigger( 'lightplayer-close' );
            
            expect( $( 'div.lightplayer' ).size() ).toBe( 0 );
        });
        
    });
    

    describe("module", function() {
        it("should add a stage as module", function() {
            expect( this.lightplayer.div.find( 'div.widget' ).find( 'div.palco' ).size() ).toBe( 1 );
        });

        it("should add a header as module", function() {
            expect( this.lightplayer.div.find( 'div.widget' ).find( 'div.header' ).size() ).toBe( 1 );
        });

        it("should add a title as module", function() {
            expect( this.lightplayer.div.find( 'div.widget' ).find( 'div.info' ).size() ).toBe( 1 );
        });
        
        it("should add a social as module", function() {
            expect( this.lightplayer.div.find( 'div.widget' ).find( 'div.social' ).size() ).toBe( 1 );
        });
    });

});


xdescribe("Light Player", function() {
    
    describe("one video", function() {
        beforeEach(function() {
            this.json = [{ id: 123, title: 'Titulo 1', description: 'Descricao 1', views: '100', url: 'http://www.globo.com' }];
            
            this.lightplayer.open( this.json );

            this.divContainer = this.lightplayer.div;
        });

        describe("open", function() {
            it("should have a container", function() {
                expect( this.divContainer.size() ).toBe( 1 );
            });

            it("should have a box", function() {
                expect( this.divContainer.find( 'div.widget' ).size() ).toBe( 1 );
            });

            it("should have an overlay", function() {
                expect( this.divContainer.find( 'div.widget-overlay' ).size() ).toBe( 1 );
            });

            it("should have a video player", function() {
                expect( this.divContainer.find( 'div.video-player' ).size() ).toBe( 1 );
                expect( this.divContainer.find( 'div.video-player' ).attr( 'data-player-videosIDs' ) ).toBe( String(this.json[0].id) );
            });
        });

    });

    xdescribe("open two videos", function() {

        describe("default", function() {
            beforeEach(function() {
                this.json = [
                    { id: 123, title: 'Titulo 1', description: 'Descricao 1', views: '100' },
                    { id: 456, title: 'Titulo 2', description: 'Descricao 2', views: '200' }
                ]; 

                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;
                this.ul = this.lightplayer.ul;
            });

            it("should have two videos", function() {
                expect( this.divContainer.find( 'ul li' ).size() ).toBe( 2 );
            });
            
            it("should mark the first item as current", function() {
                expect( this.ul.find( 'li:eq(0)' ) ).toHaveClass( 'current' );
            });

            it("should mark the second item as next", function() {
                expect( this.ul.find( 'li:eq(1)' ) ).toHaveClass( 'next' );
            }); 

            it("should show the first item's title", function() {
                var spanTitle = this.divContainer.find( 'div.video-info h6' );

                expect( spanTitle.text() ).toBe( this.json[0].title );
            });
            
            it("should show the first item's views", function() {
                var spanViews = this.divContainer.find( 'div.video-info span.views' );

                expect( spanViews.text() ).toBe( this.json[0].views + ' exibições' );
            });

            it("should show the first item's description", function() {
                var spanDescription = this.divContainer.find( 'div.video-info p' );

                expect( spanDescription.text() ).toBe( this.json[0].description );
            });


            it("should show the first item's thumb", function() {
                expect( $.fn.player ).toHaveBeenCalled();
            });
        });

        
        describe("with a item selected", function() {
            beforeEach(function() {
                this.json = [
                    { id: 123, title: 'Titulo 1', views: '100' },
                    { id: 456, title: 'Titulo 2', views: '200', current: true }
                ]; 
                
                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;
            });

            it("should mark the first item as current", function() {
                expect( this.divContainer.find( 'ul > li:eq(1)' ) ).toHaveClass( 'current' );
            });
        });
        
    });

    xdescribe("pagination", function() {
        
        describe("parameters", function() {
            beforeEach(function() {
                this.json = {
                    prevPage: 'http://www.globo.com/1',
                    nextPage: 'http://www.globo.com/3',
                    list: [
                        { id: 123, title: 'Titulo 1', views: '100' },
                        { id: 456, title: 'Titulo 2', views: '200' }
                    ]
                };

                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;

                this.nextButton = this.lightplayer.navigation.aNext;
                this.ul = this.lightplayer.ul;
            });

            it("should store the next page url", function() {
                var nextPage = this.ul.data( 'next-page' );

                expect( nextPage ).toBe( this.json.nextPage );
            });

            it("should store the prev page url", function() {
                var prevPage = this.ul.data( 'prev-page' );

                expect( prevPage ).toBe( this.json.prevPage );
            });

            it("should have a list of itens", function() {
                expect( this.ul.find( 'li' ).size() ).toBe( 2 );
            });
        });
        
        describe("one item", function() {
            it("should enable navigation if it has next page", function() {
                this.json = {
                    prevPage: '/1',
                    nextPage: '/3',
                    list: [
                        { id: 123, title: 'Titulo 1', views: '100' }
                    ]
                };

                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;
                this.nextButton = this.lightplayer.navigation.aNext;

                expect( this.nextButton ).toHaveClass( 'loading' );
                expect( this.nextButton ).toHaveClass( 'visible' );
            });

            it("should enable navigation if it has prev page", function() {
                this.json = {
                    prevPage: '/1',
                    nextPage: '/3',
                    list: [
                        { id: 123, title: 'Titulo 1', views: '100' }
                    ]
                };

                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;
                this.prevButton = this.lightplayer.navigation.aPrev;

                expect( this.prevButton ).toHaveClass( 'loading' );
                expect( this.prevButton ).toHaveClass( 'visible' );
            });
        });

        describe("last item", function() {
            beforeEach(function() {
                this.json = {
                    prevPage: 'http://www.globo.com/1',
                    nextPage: 'http://www.globo.com/3',
                    list: [
                        { id: 123, title: 'Titulo 1', views: '100' },
                        { id: 456, title: 'Titulo 2', views: '200' }
                    ]
                };

                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;

                this.nextButton = this.lightplayer.navigation.aNext;
                this.ul = this.lightplayer.ul;
            });

            it("should show next button if next page available", function() {
                this.nextButton.click();
                
                expect( this.nextButton ).toHaveClass( 'visible' );
            });

            it("should make a request to the next page url", function() {
                spyOn( $, 'getJSON' );

                this.nextButton.click();

                expect( $.getJSON ).toHaveBeenCalledWith( this.ul.data( 'next-page' ), jasmine.any( Function ) );
            });

            it("should not make a request if there is no next page", function() {
                this.json.nextPage = '';

                this.lightplayer.open( this.json );
                
                spyOn( $, 'getJSON' );

                // at this point, the this.nextButton reference is outdated
                this.lightplayer.navigation.aNext.click();
                
                expect( $.getJSON ).not.toHaveBeenCalled();
            });
            
            it("should show the next button loading", function() {
                spyOn( $, 'getJSON' );

                this.nextButton.click();

                expect( this.nextButton ).toHaveClass( 'loading' );
            });

            describe("when data is received", function() {
                beforeEach(function() {
                    var that = this;

                    this.json2 = {
                        prevPage: 'http://www.globo.com/2',
                        nextPage: 'http://www.globo.com/4',
                        list: [
                            { id: 789, title: 'Titulo 3', views: '300' },
                            { id: 12, title: 'Titulo 4', views: '400' }
                        ]
                    };

                    spyOn( $, 'getJSON' ).andCallFake( function ( url, callback ) {
                        callback( that.json2 );
                    });

                    this.nextButton.click();
                });

                it("should remove loading from next button", function() {
                    expect( this.nextButton ).not.toHaveClass( 'loading' );
                });
                
                it("should update the next page url", function() {
                    expect( this.ul.data( 'next-page' ) ).toBe( this.json2.nextPage );
                });

                it("should add the new itens to the list", function() {
                    expect( this.ul.find( 'li' ).size() ).toBe( 4 );
                });

                it("should set the next item as next", function() {
                    expect( this.ul.find( 'li.current' ).next() ).toHaveClass( 'next' );
                });

                it("should update the next nav info", function() {
                    expect( this.nextButton.find( 'span.title' ).text() ).toBe( this.json2.list[0].title );
                });
            }); // describe( "when data is received" )
        });

        describe("first item", function() {
            beforeEach(function() {
                this.json = {
                    prevPage: 'http://www.globo.com/1',
                    nextPage: 'http://www.globo.com/3',
                    list: [
                        { id: 123, title: 'Titulo 1', views: '100' },
                        { id: 456, title: 'Titulo 2', views: '200', current: true }
                    ]
                };

                this.lightplayer.open( this.json );

                this.divContainer = this.lightplayer.div;

                this.prevButton = this.lightplayer.navigation.aPrev;
                this.ul = this.lightplayer.ul;
            });

            it("should show prev button if prev page available", function() {
                expect( this.prevButton ).toHaveClass( 'visible' );
            });

            it("should make a request to the prev page url", function() {
                spyOn( $, 'getJSON' );

                this.prevButton.click();

                expect( $.getJSON ).toHaveBeenCalledWith( this.ul.data( 'prev-page' ), jasmine.any( Function ) );
            });

            it("should not make a request if there is no prev page", function() {
                this.json.prevPage = '';

                this.lightplayer.open( this.json );
                
                spyOn( $, 'getJSON' );

                // at this point, the this.nextButton reference is outdated
                this.lightplayer.navigation.aPrev.click();
                
                expect( $.getJSON ).not.toHaveBeenCalled();
            });
            
            it("should show the prev button loading", function() {
                spyOn( $, 'getJSON' );

                this.prevButton.click();

                expect( this.prevButton ).toHaveClass( 'loading' );
            });

            describe("when data is received", function() {
                beforeEach(function() {
                    var that = this;

                    this.json2 = {
                        prevPage: 'http://www.globo.com/2',
                        nextPage: 'http://www.globo.com/4',
                        list: [
                            { id: 789, title: 'Titulo 3', views: '300' },
                            { id: 12, title: 'Titulo 4', views: '400' }
                        ]
                    };

                    spyOn( $, 'getJSON' ).andCallFake( function ( url, callback ) {
                        callback( that.json2 );
                    });

                    this.prevButton.click();
                });

                it("should remove loading from prev button", function() {
                    expect( this.prevButton ).not.toHaveClass( 'loading' );
                });
                
                it("should update the prev page url", function() {
                    expect( this.ul.data( 'prev-page' ) ).toBe( this.json2.prevPage );
                });

                it("should add the new itens to the list", function() {
                    expect( this.ul.find( 'li' ).size() ).toBe( 4 );
                });

                it("should set the prev item as prev", function() {
                    expect( this.ul.find( 'li.current' ).prev() ).toHaveClass( 'prev' );
                });

                it("should update the prev nav info", function() {
                    expect( this.prevButton.find( 'span.title' ).text() ).toBe( this.json2.list[1].title );
                });
            }); // describe( "when data is received" )
        });
        
    });
    
});





/***********************************************
 * SPECS ANTIGAS PARA REFERENCIA
 ***********************************************/

//describe("Light Player Navigation", function() {

    //describe("with one item", function() {
        //beforeEach(function() {
            //this.json = [
                //{ id: 123, title: 'Titulo 1', views: '100' }
            //]; 

            //this.lightplayer.open( this.json );

            //this.divContainer = this.lightplayer.div;

            //this.prevButton = this.lightplayer.navigation.aPrev;
            //this.nextButton = this.lightplayer.navigation.aNext;
        //});

        //it("should disable navigation", function() {
            //expect( this.nextButton ).not.toHaveClass( 'visible' );
            //expect( this.prevButton ).not.toHaveClass( 'visible' );
        //});
    //});

    //describe("with more itens", function() {
        //beforeEach(function() {
            //this.json = [
                //{ id: 123, title: 'Titulo 1', views: '100' },
                //{ id: 456, title: 'Titulo 2', views: '200' },
                //{ id: 789, title: 'Titulo 3', views: '300' }
            //]; 

            //this.lightplayer.open( this.json );

            //this.divContainer = this.lightplayer.div;

            //this.li1 = this.lightplayer.ul.find( 'li:eq(0)' );
            //this.li2 = this.lightplayer.ul.find( 'li:eq(1)' );
            //this.li3 = this.lightplayer.ul.find( 'li:eq(2)' );

            //this.prevButton = this.lightplayer.navigation.aPrev;
            //this.nextButton = this.lightplayer.navigation.aNext;
        //});


        //describe("next", function() {
            //it("should have a next button", function() {
                //expect( this.nextButton.size() ).toBe( 1 );
            //});

            //it("should have a next button enabled", function() {
                //expect( this.nextButton ).toHaveClass( 'visible' );
            //});

            //it("should have a chapeu about the next video", function() {
                //expect( this.nextButton.find( 'span.chapeu' ).size() ).toBe( 1 );
            //});

            //it("should have a title about the next video", function() {
                //expect( this.nextButton.find( 'span.title' ).size() ).toBe( 1 );
                //expect( this.nextButton.find( 'span.title' ).text() ).toBe( this.json[1].title );
            //});

            //it("should navigate to the next", function() {
                //expect( this.li1 ).toHaveClass( 'current' );
                //expect( this.li2 ).toHaveClass( 'next' );
                //expect( this.li3 ).not.toHaveClass();

                //this.nextButton.click();

                //expect( this.li1 ).toHaveClass( 'prev' );
                //expect( this.li2 ).toHaveClass( 'current' );
                //expect( this.li3 ).toHaveClass( 'next' );

                //this.nextButton.click();

                //expect( this.li1 ).not.toHaveClass();
                //expect( this.li2 ).toHaveClass( 'prev' );
                //expect( this.li3 ).toHaveClass( 'current' );
            //});

            //it("should not navigate to the next when showing last item", function() {
                //this.nextButton.click();
                //this.nextButton.click();
                //this.nextButton.click();

                //expect( this.li3 ).toHaveClass( 'current' );
            //});

            //it("should disable the button next on last item", function() {
                //this.nextButton.click();

                //// Here we're on last item

                //this.nextButton.click();

                //expect( this.nextButton ).not.toHaveClass( 'visible' );
            //});

            //it("should enable the button next when coming from the last item", function() {
                //this.nextButton.click();

                //// Here we're on last item

                //this.nextButton.click();
                //this.prevButton.click();

                //expect( this.nextButton ).toHaveClass( 'visible' );
            //});

            //it("should go to the next item with Right key", function() {
                //var evt = jQuery.Event('keydown');
                //evt.which = 39;

                //$( document ).trigger( evt );

                //expect( this.li2 ).toHaveClass( 'current' );
            //});

        //});


        //describe("prev", function() {
            //it("should have a prev button", function() {
                //expect( this.prevButton.size() ).toBe( 1 );
            //});

            //it("should have a prev button disabled", function() {
                //expect( this.prevButton ).not.toHaveClass( 'visible' );
            //});

            //it("should have a chapeu about the prev video", function() {
                //expect( this.prevButton.find( 'span.chapeu' ).size() ).toBe( 1 );
            //});

            //it("should have a title about the prev video", function() {
                //expect( this.prevButton.find( 'span.title' ).size() ).toBe( 1 );
            //});

            //it("should have the title about the prev video", function() {
                //this.nextButton.click();

                //expect( this.prevButton.find( 'span.title' ).text() ).toBe( this.json[0].title );
            //});

            //it("should navigate to the prev", function() {
                //this.nextButton.click();
                //this.nextButton.click();

                //expect( this.li1 ).not.toHaveClass();
                //expect( this.li2 ).toHaveClass( 'prev' );
                //expect( this.li3 ).toHaveClass( 'current' );

                //this.prevButton.click();

                //expect( this.li1 ).toHaveClass( 'prev' );
                //expect( this.li2 ).toHaveClass( 'current' );
                //expect( this.li3 ).toHaveClass( 'next' );

                //this.prevButton.click();

                //expect( this.li1 ).toHaveClass( 'current' );
                //expect( this.li2 ).toHaveClass( 'next' );
                //expect( this.li3 ).not.toHaveClass();
            //});

            //it("should not navigate to the prev on open", function() {
                //this.prevButton.click();

                //expect( this.li1 ).toHaveClass( 'current' );
            //});

            //it("should enable the button prev on second item", function() {
                //this.nextButton.click();

                //expect( this.prevButton ).toHaveClass( 'visible' );
            //});

            //it("should disable the button prev when coming from the second item", function() {
                //this.nextButton.click();
                //this.prevButton.click();

                //expect( this.prevButton ).not.toHaveClass( 'visible' );
            //});

            //it("should go to the next item with Left key", function() {
                //// Go to the second item first
                //this.nextButton.click();

                //var evt = jQuery.Event( 'keydown' );
                //evt.which = 37;
                //$( document ).trigger( evt );

                //expect( this.li1 ).toHaveClass( 'current' );
            //});

            //it("should dettach Left key event from document", function() {
                //expect( $( document ).data( 'events' ) ).toBeDefined();

                //this.lightplayer.close();

                //expect( $( document ).data( 'events' ) ).not.toBeDefined();
            //});

        //}); // describe("prev")

    //}); // describe("with more itens")

//}); // describe("navigation")

