/***********************************************
 * MODULO STAGE
 ***********************************************/

describe("Module: Stage", function() {
    beforeEach(function() {
        this.json = {
            list: [
                { id: 123, title: 'titulo 1' },
                { id: 456, title: 'titulo 2' },
                { id: 789, title: 'titulo 3' }
            ]
        };
    });

    describe("no item as current", function() {
        // TODO
    });
    
    describe("first item", function() {
        beforeEach(function() {
            this.json.list[0].current = true;

            this.stage = new Stage( this.json );
            this.stage.init();

            this.liCurrent = this.stage.domRoot.find( 'ul li.current' );
        });
        
        it("should render", function() {
            expect( this.liCurrent.size() ).toBe( 1 );
            expect( this.liCurrent.attr( 'id' ) ).toBe( 'item-123' );
        });

        it("should have a video player div", function() {
            expect( this.liCurrent.find( 'div.video-player' ).size() ).toBe( 1 );
        });

        it("should have a video player id", function() {
            var dataPlayerVideosIDs = this.liCurrent.find( 'div.video-player' ).attr( 'data-player-videosIDs' );
            expect( dataPlayerVideosIDs ).toBe( String(this.json.list[0].id) );
        });
    });

    describe("second item", function() {
        beforeEach(function() {
            this.json.list[1].current = true;

            this.stage = new Stage( this.json );
            this.stage.init();

            this.liCurrent = this.stage.domRoot.find( 'ul li.current' );
        });
        
        it("should render", function() {
            expect( this.liCurrent.size() ).toBe( 1 );
            expect( this.liCurrent.attr( 'id' ) ).toBe( 'item-456' );
        });

        it("should have a video player div", function() {
            expect( this.liCurrent.find( 'div.video-player' ).size() ).toBe( 1 );
        });

        it("should have a video player id", function() {
            var dataPlayerVideosIDs = this.liCurrent.find( 'div.video-player' ).attr( 'data-player-videosIDs' );
            expect( dataPlayerVideosIDs ).toBe( String(this.json.list[1].id) );
        });
    });

    describe("arrows", function() {
        beforeEach(function() {
            this.json.list[1].current = true;

            this.stage = new Stage( this.json );
            this.stage.init();
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
                this.json.list[0].current = true;

                this.stage = new Stage( this.json );
                this.stage.init();

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
                var nextTitle = this.json.list[1].title;
                expect( this.nextButton.find( 'span.titulo' ).text() ).toBe( nextTitle );
            });
        });

        describe("middle", function() {
            beforeEach(function() {
                this.json.list[1].current = true;

                this.stage = new Stage( this.json );
                this.stage.init();

                this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
                this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
            });
            
            it("should have the PREV button visible", function () {
                expect( this.prevButton ).toHaveClass( 'visible' );
            });

            it("should have the PREV button with the previous item title", function () {
                var prevTitle = this.json.list[0].title;
                expect( this.prevButton.find( 'span.titulo' ).text() ).toBe( prevTitle );
            });

            it("should have the NEXT button visible", function () {
                expect( this.nextButton ).toHaveClass( 'visible' );
            });

            it("should have the NEXT button with the next item title", function () {
                var nextTitle = this.json.list[2].title;
                expect( this.nextButton.find( 'span.titulo' ).text() ).toBe( nextTitle );
            });
        });

        describe("end", function() {
            beforeEach(function() {
                this.json.list[2].current = true;

                this.stage = new Stage( this.json );
                this.stage.init();

                this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
                this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
            });
            
            it("should have the PREV button visible", function () {
                expect( this.prevButton ).toHaveClass( 'visible' );
            });

            it("should have the PREV button with the prev item title", function () {
                var prevTitle = this.json.list[1].title;
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
            this.json.list[1].current = true;

            this.stage = new Stage( this.json );
            this.stage.init();

            this.nextButton = this.stage.domRoot.find( 'a.nav.next' );
            this.prevButton = this.stage.domRoot.find( 'a.nav.prev' );
        });

        describe("NEXT button", function() {
            beforeEach(function() {
                this.nextButton.click();
            });
            
            it("should move to the next item", function() {
                expect( this.stage.domRoot.find( 'ul li.current' ).attr( 'id' ) ).toBe( 'item-789' );
            });

            it("should update json", function() {
                expect( this.stage.json.list[2].current ).toBe( true );
            });

            it("should not be visible", function() {
                expect( this.nextButton ).not.toHaveClass( 'visible' );
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
                expect( this.stage.json.list[0].current ).toBe( true );
            });

            it("should not be visible", function() {
                expect( this.prevButton ).not.toHaveClass( 'visible' );
            });
        });

    });
    
});
