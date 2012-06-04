/***********************************************
 * MODULO HEADER
 ***********************************************/

describe("Module: Header", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            title: 'mais videos',
            subtitle: 'melhores videos do mesmo tema',
            list: [
                { id: 123, title: 'titulo 1' },
                { id: 456, title: 'titulo 2' },
                { id: 789, title: 'titulo 3' }
            ]
        };

        this.header = new Header( this.bus, this.json );
        this.header.init();
    });

    it("should show the lightbox title", function() {
        expect( this.header.domRoot.find( 'h5' ).text() ).toBe( this.json.title );
    });

    it("should show the lightbox subtitle", function() {
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