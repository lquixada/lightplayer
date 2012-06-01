
/***********************************************
 * MODULO STAGE
 ***********************************************/

Stage = function ( json ) {
    this.json = json;
};

Stage.prototype = {
    init: function () {
        this._render();
        this._addEvents();

        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;

        this.domRoot
            .delegate( 'a.nav.next', 'click', function () {
                that._goNext();
            } )
            .delegate( 'a.nav.prev', 'click', function () {
                that._goPrev();
            } );
    },

    _addItem: function( position ) {
        var itemHTML,
            item = this._getItem( position ),
            ul = this.domRoot.find( 'ul' );
        
        itemHTML = [
            '<li id="item-'+item.id+'" class="'+position+'">',
                '<div class="video-player" data-player-videosIDs='+item.id+'></div>',
            '</li>',
        ].join( '' );
        
        if ( position === 'prev' ) {
            ul.prepend( itemHTML );
        } else {
            ul.append( itemHTML );
        }

        return item;
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

    _go: function ( position ) {
        var item, that = this;

        this.domRoot.find( 'li.next, li.prev' ).remove();

        item = this._addItem( position );

        // Por algum motivo, sem o setTimeout a transicao CSS3 n funfa no Chrome
        setTimeout( function () {
            if ( position === 'next' ) {
                that.domRoot.find( 'li.current' ).removeClass( 'current' ).addClass( 'prev' );
                that.domRoot.find( 'li.next' ).removeClass( 'next' ).addClass( 'current' );
            } else {
                that.domRoot.find( 'li.current' ).removeClass( 'current' ).addClass( 'next' );
                that.domRoot.find( 'li.prev' ).removeClass( 'prev' ).addClass( 'current' );
            }
        }, 100);
        
        this._setItemAsCurrent( item );
    },

    _goNext: function () {
        this._go( 'next' );
        this._updateArrows();
    },

    _goPrev: function () {
        this._go( 'prev' );
        this._updateArrows();
    },

    _render: function () {
        this._renderRoot();
        this._renderArrows();
        this._addItem( 'current' );
    },

    _renderArrow: function ( position ) {
        var label = ( position === 'next'? 'Próximo': 'Anterior' );

        this.domRoot.append( [
            '<a href="javascript:;" class="nav '+position+' visible">',
                '<span class="arrow"></span>',
                '<span class="info">',
                    '<span class="chapeu">'+label+'</span>',
                    '<span class="titulo"></span>',
                '</span>',
            '</a>'
        ].join( '' ) ); 
    },

    _renderArrows: function () {
        this._renderArrow( 'next' );
        this._renderArrow( 'prev' );
        this._updateArrows();
    },

    _renderRoot: function () {
        this.domRoot = $( [
            '<div class="palco">',
                '<ul></ul>',
            '</div>'
        ].join( '' ) ); 
    },

    _setItemAsCurrent: function  ( itemChosen ) {
        var itens = this.json.list;

        $.each( itens, function () {
            this.current = false;
        });

        itemChosen.current = true;
    },

    _updateArrows: function () {
        var first = this.json.list[0],
            last = this.json.list[this.json.list.length-1];

        this.domRoot.find( 'a.nav' ).removeClass( 'visible' );

        if ( first.current ) {
            this._updateNextArrow();
        } else if ( last.current ) {
            this._updatePrevArrow();
        } else {
            this._updatePrevArrow();
            this._updateNextArrow();
        }
    },

    _updateNextArrow: function () {
        var item = this._getItem( 'next' );

        this.domRoot.find( 'a.nav.next' ).addClass( 'visible' )
            .find( 'span.titulo' ).text( item.title );
    },

    _updatePrevArrow: function () {
        var item = this._getItem( 'prev' );

        this.domRoot.find( 'a.nav.prev' ).addClass( 'visible' )
            .find( 'span.titulo' ).text( item.title );
    }
};

