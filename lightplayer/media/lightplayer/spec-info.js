/***********************************************
 * MODULO INFO
 ***********************************************/

describe("Module: Info", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            list: [
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
        expect( this.info.domRoot.find( 'h6' ).html() ).toBe( this.json.list[1].title );
    });

    it("should have a description", function() {
        expect( this.info.domRoot.find( 'p' ).text() ).toBe( this.json.list[1].description );
    });

    it("should have views count", function() {
        expect( this.info.domRoot.find( 'span.views' ).text() ).toBe( this.json.list[1].views+' exibições' );
    });

    it("should update on new current item", function() {
        var div = this.info.domRoot,
            current = this.json.list[2];
        
        this.json.list[1].current = false;
        this.json.list[2].current = true;

        this.bus.trigger( { type: 'video-change', json: this.json } );
        
        expect( div.find( 'h6' ).text() ).toBe( current.title );
        expect( div.find( 'p' ).text() ).toBe( current.description );
        expect( div.find( 'span.views' ).text() ).toBe( current.views+' exibições' );
    });
    
});
