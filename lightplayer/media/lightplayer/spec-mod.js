/***********************************************
 * MODULO BASIC
 ***********************************************/

describe("Module: Basic Module", function() {
    beforeEach(function() {
        this.json = {
            list: [
                { id: 123, title: 'titulo 1', description: 'desc 1', views: 1000 },
                { id: 456, title: 'titulo 2', description: 'desc 2', views: 2000, current: true },
                { id: 789, title: 'titulo 3', description: 'desc 3', views: 3000 }
            ]
        };

        this.mod = new Mod();
        this.mod.init( null, this.json );
    });

    it("should have a name", function() {
        expect( this.mod.name ).toBe( 'mod-name' );
    });
    
    it("should have a json with a list", function() {
        expect( this.mod.json ).toBe( this.json );
        expect( this.mod.json.list ).toBe( this.json.list );
    });

    describe("getItem", function() {
        it("should get the current item", function() {
            expect( this.mod._getItem( 'current' ) ).toBe( this.json.list[1] );
        });
        
        it("should get the next item", function() {
            expect( this.mod._getItem( 'next' ) ).toBe( this.json.list[2] );
        });
        
        it("should get the next item as null if current is last", function() {
            this.json.list[1].current = false;
            this.json.list[2].current = true;

            this.mod = new Mod();
            this.mod.init( null, this.json );

            expect( $.isEmptyObject( this.mod._getItem( 'next' ) ) ).toBe( true );
        });

        it("should get the prev item", function () {
            expect( this.mod._getItem( 'prev' ) ).toBe( this.json.list[0] );
        });

        it("should get the prev item as null if current is first", function() {
            this.json.list[1].current = false;
            this.json.list[0].current = true;

            this.mod = new Mod();
            this.mod.init( null, this.json );

            expect( $.isEmptyObject( this.mod._getItem( 'prev' ) ) ).toBe( true );
        });
    });

    describe("setItemAsCurrent", function() {
        it("should mark new item as current", function() {
            this.mod._setItemAsCurrent( this.json.list[2] );

            expect( this.json.list[2].current ).toBe( true );
        });
        
        it("should unmark all the remaining itens as not current", function() {
            this.mod._setItemAsCurrent( this.json.list[2] );

            expect( this.json.list[0].current ).toBeFalsy();
            expect( this.json.list[1].current ).toBeFalsy();
        });
    });

});
