
/***********************************************
 * MODULO INFO
 ***********************************************/

describe("Module: Info", function() {
	beforeEach(function() {
		this.bus = new o.Event();
		this.json = {
			itens: [
				{ id: 123, title: 'titulo 1', description: 'desc 1', hat: 'chapeu 1', views: 1000 },
				{ id: 456, title: 'titulo 2', description: 'desc 2', hat: 'chapeu 2', views: 2000, current: true },
				{ id: 789, title: 'titulo 3', description: 'desc 3', hat: 'chapeu 3', views: 3000 }
			]
		};

		this.info = new Info( this.bus, this.json );
	});

	it("should have a name", function() {
		expect( this.info.name ).toBe( 'info' );
	});
	
	it("should have a default title", function() {
		expect( this.info.domRoot.find( 'h6' ).html() ).toBe( this.json.itens[1].title );
	});

	it("should have views count", function() {
		expect( this.info.domRoot.find( 'span.chapeu' ).text() ).toBe( this.json.itens[1].hat );
	});

	it("should update on new current item", function() {
		var div = this.info.domRoot,
			current = this.json.itens[2];
		
		this.json.itens[1].current = false;
		this.json.itens[2].current = true;

		this.info.bus.fire( 'video-change', { json: this.json } );
		
		expect( div.find( 'h6' ).text() ).toBe( current.title );
		expect( div.find( 'span.chapeu' ).text() ).toBe( current.hat );
	});
	
});

