/***********************************************
 * MODULO HEADER
 ***********************************************/

describe("Module: Header", function() {
    beforeEach(function() {
        this.bus = $({});
        this.json = {
            list: [
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
