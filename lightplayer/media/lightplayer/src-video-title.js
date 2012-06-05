
/***********************************************
 * MODULO TITLE
 ***********************************************/

VideoTitle = function () {};

VideoTitle.prototype = {
    init: function ( bus, json ) {
        this.name = 'video title';
        this.bus = bus;
        this.json = json;

        this._render();
        this._addEvents();
        
        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;

        this.bus.bind( 'video-change', function ( evt ) {
            that.json = evt.json;
            that._updateItem();
        } );
    },

    _getItem: function ( position ) {
        var itemChosen, itens = this.json.list,
            choose = function ( i ) {
                if ( position === 'current' ) {  return itens[i];   }
                if ( position === 'next' ) {     return itens[i+1]; }
                if ( position === 'prev' ) {     return itens[i-1]; }
            };
        
        $.each( itens, function ( i ) {
            if ( this.current ) {
                itemChosen = choose( i );
                return false;
            }
        });
        
        return itemChosen || {};
    },

    _render: function () {
        var item = this._getItem( 'current' );

        this.domRoot = $( [
            '<div class="video-info">',
                '<h6>'+item.title+'</h6>',
                ' ', // Espaço intencional
                '<span class="views">'+item.views+' exibições</span>',
                '<p>'+item.description+'</p>',
            '</div>'
        ].join( '' ) );
    },

    _updateItem: function () {
        var item = this._getItem( 'current' );

        this.domRoot.find( 'h6' ).text( item.title );
        this.domRoot.find( 'span.views' ).text( item.views+' exibições' );
        this.domRoot.find( 'p' ).text( item.description );
    }
};

