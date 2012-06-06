
/***********************************************
 * MODULO MOD
 ***********************************************/

Mod = function () {};

Mod.prototype = {
    init: function ( bus, json ) {
        this.name = 'mod-name';
        this.bus = bus;
        this.json = json;

        this._render();
        this._addEvents();
        
        return this.domRoot;
    },

    // private

    _addEvents: function () {
        // Define all events attachments here
    },

    _getItem: function ( position ) {
        var itemChosen, itens = this.json.list,
            choose = function ( i ) {
                if ( position === 'current' ) { return itens[i];   }
                if ( position === 'next' ) {    return itens[i+1]; }
                if ( position === 'prev' ) {    return itens[i-1]; }
            };
        
        $.each( itens, function ( i ) {
            if ( this.current ) {
                itemChosen = choose( i );
                return false;
            }
        });
        
        return itemChosen || {};
    },

    _setItemAsCurrent: function ( itemChosen ) {
        var itens = this.json.list;

        $.each( itens, function () {
            this.current = false;
        });

        itemChosen.current = true;
    },

    _render: function () {
        // Create all the DOM subtree here
        // And then assign the root to this.domRoot
    }
};

