/***********************************************
 * MODULO HEADER
 ***********************************************/

describe("Module: Video Title", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            list: [
                { id: 123, title: 'titulo 1', description: 'desc 1', views: 1000 },
                { id: 456, title: 'titulo 2', description: 'desc 2', views: 2000, current: true },
                { id: 789, title: 'titulo 3', description: 'desc 3', views: 3000 }
            ]
        };

        this.title = new VideoTitle();
        this.title.init( this.bus, this.json );
    });

    it("should have a name", function() {
        this.title.init( this.bus, this.json );

        expect( this.title.name ).toBe( 'video title' );
    });
    
    it("should have a default title", function() {
        expect( this.title.domRoot.find( 'h6' ).html() ).toBe( this.json.list[1].title );
    });

    it("should have a description", function() {
        expect( this.title.domRoot.find( 'p' ).text() ).toBe( this.json.list[1].description );
    });

    it("should have views count", function() {
        expect( this.title.domRoot.find( 'span.views' ).text() ).toBe( this.json.list[1].views+' exibições' );
    });

    it("should update on new current item", function() {
        var div = this.title.domRoot,
            current = this.json.list[2];
        
        this.json.list[1].current = false;
        this.json.list[2].current = true;

        this.bus.trigger( { type: 'video-change', json: this.json } );
        
        expect( div.find( 'h6' ).text() ).toBe( current.title );
        expect( div.find( 'p' ).text() ).toBe( current.description );
        expect( div.find( 'span.views' ).text() ).toBe( current.views+' exibições' );
    });
    
});
