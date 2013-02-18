/***********************************************
 * MODULO STAGE
 ***********************************************/

describe("Module: Stage", function() {
	beforeEach(function() {
		this.bus = $( {} );
		this.json = {
			itens: [
				{ id: 123, title: 'titulo 1', hat: 'chapeu 1' },
				{ id: 456, title: 'titulo 2', hat: 'chapeu 2' },
				{ id: 789, title: 'titulo 3', hat: 'chapeu 3' }
			]
		};
	});

	describe("no item as current", function() {
		// TODO
	});

	it("should have a name", function() {
		this.stage = new Stage( this.bus, this.json );

		expect( this.stage.name ).toBe( 'stage' );
	});

	describe("one item", function() {
		beforeEach(function() {
			this.json = {
				itens: [
					{ id: 123, title: 'titulo 1' }
				]
			};
		});
		
		it("should not have arrows visible", function() {
			this.stage = new Stage( this.bus, this.json );

			expect( this.stage.domRoot.find( 'a.nav.visible' ).size() ).toBe( 0 );
		});

		it("should add some margin at the bottom", function() {
			this.stage = new Stage( this.bus, this.json );

			expect( this.stage.domRoot.css( 'margin-bottom' ) ).not.toBe( '' );
		});
	});
	
	describe("first item", function() {
		beforeEach(function() {
			this.json.itens[0].current = true;

			this.stage = new Stage( this.bus, this.json );

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

			this.stage = new Stage( this.bus, this.json );

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

			this.stage = new Stage( this.bus, this.json );

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

			this.stage = new Stage( this.bus, this.json );

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
			this.stage = new Stage( this.bus, this.json );

			expect( this.playerParams.sitePage ).toBe( this.json.sitePage );
		});
		

		// REVER SPECS DE AUTOPLAY
		//it("should not enable autoPlay", function() {
			//expect( this.playerParams.autoPlay ).toBe( false );
		//});

		//it("should configure the autoPlay", function() {
			//this.json.autoPlay = true;

			//this.stage = new Stage( this.bus, this.json );

			//expect( this.playerParams.autoPlay ).toBe( true );
		//});
		
		it("should not enable autoNext", function() {
			spyOn( this.stage, '_goNext' );

			this.playerParams.complete();

			expect( this.stage._goNext ).not.toHaveBeenCalled();
		});

		it("should enable autoNext", function() {
			this.json.autoNext = true;
			
			this.stage = new Stage( this.bus, this.json );

			spyOn( this.stage, '_goNext' );

			this.playerParams.complete();

			expect( this.stage._goNext ).toHaveBeenCalled();
		});
	});

	describe("arrows", function() {
		beforeEach(function() {
			this.json.itens[1].current = true;

			this.stage = new Stage( this.bus, this.json );
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
				expect( this.nextButton.find( 'span.chapeu' ).text() ).toBe( 'chapeu 3' );
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
				expect( this.prevButton.find( 'span.chapeu' ).text() ).toBe( 'chapeu 1' );
			});
		});
	});

	describe("scenarios", function() {
		
		describe("beginning", function() {
			beforeEach(function() {
				this.json.itens[0].current = true;

				this.stage = new Stage( this.bus, this.json );

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

				this.stage = new Stage( this.bus, this.json );

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

				this.stage = new Stage( this.bus, this.json );

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
			
			this.stage = new Stage( this.bus, this.json );

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
				
				this.stage = new Stage( this.bus, this.json );
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
				
				this.stage = new Stage( this.bus, this.json );
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


