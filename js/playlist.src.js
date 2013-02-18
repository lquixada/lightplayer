
/**
 * @class Playlist
 * @extends Mod
 */


Playlist = o.clazz({
		extend: Mod,
    /**
     * Inicializa a Playlist com o barramento e o json
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
        this.name = 'playlist';

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
        this.thumbHost = json.thumbHost || 'http://img.video.globo.com';
        this.offset = 0; 
        
        if ( this.json.itens.length > 1 ) {
            this._render();
            this._addEvents();
        }

        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;

        this.sub( 'video-change', function ( event ) {
            var a, item;

            that.json = event.json;

            item = that._getItem( 'current' );

            a = that.domRoot.find( 'a[item-id='+item.id+']' );
            that._setAsWatching( a.parent() );
        } );

        this.domRoot
            .delegate( 'a.next:not(.inativo)', 'click', function () {
                that._goNext();
            })
            .delegate( 'a.prev:not(.inativo)', 'click', function () {
                that._goPrev();
            })
            .delegate( 'div.trilho-videos a', 'click', function () {
                var item = that._getItemById( $( this ).attr( 'item-id' ) );

                that._setItemAsCurrent( item );
                that.pub( 'video-change', that.json );

                that._setAsWatching( $( this ).parent() );

                return false;
            });

        $( document ).bind( 'keydown.lightplayer', function ( evt ) {
            /* RIGHT key */
            if ( evt.shiftKey && evt.which === 39 ) {
                that.domRoot.find( 'a.next' ).click();
            }
            
            /* LEFT key */
            if ( evt.shiftKey && evt.which === 37 ) {
                that.domRoot.find( 'a.prev' ).click();
            }
        } ); 
    },

    _goNext: function () {
        var ulNext = this.current.next();

        this.offset += -parseInt( ulNext.css( 'width' ), 10 );
        
        this._move();

        this._setCurrent( ulNext );
        this._updateArrows();
    },
    
    _goPrev: function () {
        this.offset += parseInt( this.current.css( 'width' ), 10 );
        
        this._move();

        this._setCurrent( this.current.prev() );
        this._updateArrows();
    },

    _move: function ( ul ) {
        this.domRoot.find( 'div.film-strip' ).css( 'margin-left', this.offset );
    },

    _render: function () {
        this._renderContainer();
        this._renderItens();

        this._setCurrent( this.domRoot.find( 'ul.current' ) );
        this._updateArrows();
    },

    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="playlist">',
                '<a class="nav prev"></a>',
                '<div class="trilho-videos"><div class="film-strip"></div></div>',
                '<a class="nav next"></a>',
                '<span class="borda-inferior"></span>',
            '</div>'
        ].join( '' ) );
    },

    _renderItens: function () {
        var html = '<ul>',
            that = this;

        $.each( this.json.itens, function ( i ) {
            html += (i>0 && i%4 === 0? '</ul><ul>':'');
            html += [
                '<li '+(this.current? 'class="assistindo"': '')+'>',
                    '<a href="javascript:;" item-id="'+this.id+'" title="'+this.title+'">',
                        '<img src="'+that.thumbHost+'/180x108/'+this.id+'.jpg">',
                        '<span class="hover-img"></span>',
                        
                        '<span class="layer"></span>',
                        '<span class="label">assistindo</span>',
                        
                        (this.hat? '<span class="chapeu">'+this.hat+'</span>': ''),
                        
                        '<span class="titulo-item">'+that.truncate(this.title, 40)+'</span>',
                        '<span class="exibicao"><strong>'+this.views+'</strong> exibições</span>',
                    '</a>',
                '</li>'
            ].join( '' );
        } );

        html += '</ul>';

        this.domRoot.find( 'div.film-strip' ).append( html );
    },

    _setAsWatching: function ( li ) {
        this.domRoot.find( 'li.assistindo' ).removeClass( 'assistindo' );

        li.addClass( 'assistindo' );
    },

    _setCurrent: function ( newCurrent ) {
        if ( newCurrent.size() === 0 ) {
            this.current = this.domRoot.find( 'ul:first' ).addClass( 'current' );
        } else {
            this.current.removeClass( 'current' );
            this.current = newCurrent.addClass( 'current' );
        }
    },

    _updateArrows: function () {
        this.domRoot.find( 'a.nav' ).removeClass( 'inativo' );

        if ( this.current.next().size() === 0 ) {
            this.domRoot.find( 'a.next' ).addClass( 'inativo' );
        }

        if ( this.current.prev().size() === 0 ) {
            this.domRoot.find( 'a.prev' ).addClass( 'inativo' );
        }
    }
});
