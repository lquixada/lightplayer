
/**
 * @class Stage
 * @extends Mod
 * @constructor
 */


Stage = o.clazz({
		extend: Mod,
    /**
     * Inicializa o Placo com o barramento e o json
     *
     * @method init
     * @param bus {Object} O barramento com o qual o módulo vai se comunicar
     * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
     * @return {Object} O nó raiz da subárvore DOM do módulo
     */
    boot: function ( bus, json ) {
        /**
         * @property name
         * @type String
         */
        this.name = 'stage';

        /**
         * @property bus
         * @type Object
         */
        this.bus = bus;

        /**
         * @property json
         * @type Object
         */
        this.json = json;

        this.autoPlay = false;

        this._render();
        this._addEvents();

        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;
        
        this.sub( 'video-change', function ( evt ) {
            var current, currentNew, item;

            current = that._getItem( 'current' );

            that.json = evt.json;

            currentNew = that._getItem( 'current' );
            
            if ( currentNew.index < current.index ) {
                that._simulatePrev();
            } else {
                that._simulateNext();
            }
        } );

        this.sub( 'lightplayer-opened', function () {
            if ( that.json.autoPlay ) {
                that.autoPlay = true;
                that.domRoot.find( 'li.current div.video-player' ).playerApiCaller( 'playVideo' );
            }
        } );

        this.domRoot
            .delegate( 'a.nav.next', 'click', function () {
                that._goNext();
            } )
            .delegate( 'a.nav.prev', 'click', function () {
                that._goPrev();
            } )
            .delegate( 'a.nav:not(.loading)', 'mouseenter', function () {
                that._unfoldInfo( $( this ) );
            } )
            .delegate( 'a.nav:not(.loading)', 'mouseleave', function () {
                that._foldInfo( $( this ) );
            } );
        
        $( document ).bind( 'keydown.lightplayer', function ( evt ) {
            /* RIGHT key */
            if ( !evt.shiftKey && evt.which === 39 ) {
                that.domRoot.find( 'a.next.visible' ).click();
            }
            
            /* LEFT key */
            if ( !evt.shiftKey && evt.which === 37 ) {
                that.domRoot.find( 'a.prev.visible' ).click();
            }
        } ); 
    },

    _addItem: function ( position ) {
        var item = this._getItem( position ) || {};
        
        this.domRoot.find( 'ul' ).append( [
            '<li id="item-'+item.id+'" class="'+position+'">',
                '<div class="video-player"></div>',
            '</li>'
        ].join( '' ) );

        return item;
    },

    _animateArrow: function () {
        this.domRoot.find( 'a.nav.next.visible span.arrow' )
            .animate( { right: '25px', opacity: 1 }, 200, function () {
                $( this ).animate( { right:'15px' }, 550, 'easeOutBounce' );
            } );
    },

    _clear: function () {
        this.domRoot.find( 'li.current div.video-player' ).html( '' );
    },

    _foldInfo: function ( a ) {
        // Hide arrow
        a.stop().find( 'span.arrow' ).fadeTo( 250, 0.2 );

        // First hide info
        a.stop().find( 'span.info' ).fadeOut( 300, function () {
            // Then close box
            a.stop().animate( { width: 0 }, 250 );
        });
    },

    _go: function ( position ) {
        var item, that = this;

        this.domRoot.find( 'li.next, li.prev' ).remove();

        item = this._addItem( position );

        this.domRoot.width();

        if ( position === 'next' ) {
            this.domRoot.find( 'li.current' ).removeClass( 'current' ).addClass( 'prev' );
            this.domRoot.find( 'li.next' ).removeClass( 'next' ).addClass( 'current' );
        } else {
            this.domRoot.find( 'li.current' ).removeClass( 'current' ).addClass( 'next' );
            this.domRoot.find( 'li.prev' ).removeClass( 'prev' ).addClass( 'current' );
        }
        
        this._setItemAsCurrent( item );
    },

    _goNext: function () {
        var item = this._getItem( 'next' ) || {};
        
        this._clear();
        this._go( 'next' );
        this._updateArrows();
        this._updateItem( item );

        this.pub( 'video-change', this.json );
    },

    _goPrev: function () {
        var item = this._getItem( 'prev' ) || {};
        
        this._clear();
        this._go( 'prev' );
        this._updateArrows();
        this._updateItem( item );

        this.pub( 'video-change', this.json );
    },

    _onVideoCompleted: function () {
        var a;

        if ( this.json.autoNext ) {
            this._goNext();
        } else {
            a = this.domRoot.find( 'a.nav.next.visible' );
            this._unfoldInfo( a );
        }
    },

    _render: function () {
        var item = this._getItem( 'current' ) || {};

        this._renderRoot();
        this._renderArrows();
        this._addItem( 'current' );
        this._updateItem( item );

        if ( this.json.itens.length == 1 ) {
            this.domRoot.css( 'margin-bottom', '30px' );
        }
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
                '<span class="overlay"></span>',
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

    // When user clicks in a non-adjacent item, it jumps to this item
    // but simulates it is the next one
    _simulateNext: function () {
        var item = this._getItem( 'prev' );

        this._setItemAsCurrent( item );
        this._goNext();
    },
    
    // When user clicks in a non-adjacent item, it jumps to this item
    // but simulates it is the previous one
    _simulatePrev: function () {
        var item = this._getItem( 'next' );

        this._setItemAsCurrent( item );
        this._goPrev();        
    },

    _startArrowAnimation: function () {
        this._animateArrow();

        this.timer = setInterval( $.proxy( this, '_animateArrow' ), 1400 );
    },

    _stopArrowAnimation: function () {
        clearInterval( this.timer );
    },

    _unfoldInfo: function ( a ) {
        clearInterval( this.timer );
        
        // Show arrow
        a.stop().find( 'span.arrow' ).fadeTo( 250, 1 );

        // First open box
        a.stop().animate( { width: 245 }, 250, function () {
            // Then show info
            a.find( 'span.info' ).fadeIn();
        } ); 
    },

    _updateArrows: function () {
        var first = this.json.itens[0],
            last = this.json.itens[this.json.itens.length-1];

        this.domRoot.find( 'a.nav' ).removeClass( 'visible' );
        
        if ( first == last ) {
            return;
        }

        if ( first.current ) {
            this._updateNextArrow();
        } else if ( last.current ) {
            this._updatePrevArrow();
        } else {
            this._updatePrevArrow();
            this._updateNextArrow();
        }
    },

    _updateItem: function ( item ) {
        var that = this,
            width = (this.json.mode === 'sd'? 480: 640);

        this.domRoot.find( 'li.current div.video-player' )
            .width( width )
            .player( {
                videosIDs: item.id,
                autoPlay: this.autoPlay,
                sitePage: this.json.sitePage || '',
                width: width,
                height: 360,
                complete: $.proxy( this, '_onVideoCompleted' )
            });
    },

    _updateNextArrow: function () {
        var item = this._getItem( 'next' ) || {};

        this.domRoot.find( 'a.nav.next' ).addClass( 'visible' )
            .find( 'span.chapeu' ).html( item.hat || '' ).end()
            .find( 'span.titulo' ).text( this.truncate( item.title, 100 ) );
    },

    _updatePrevArrow: function () {
        var item = this._getItem( 'prev' ) || {};

        this.domRoot.find( 'a.nav.prev' ).addClass( 'visible' )
            .find( 'span.chapeu' ).html( item.hat || '' ).end()
            .find( 'span.titulo' ).text( item.title );
    }
});
