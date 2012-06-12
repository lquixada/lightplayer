function LightPlayerNovelas () {}

LightPlayerNovelas.prototype = $.extend( new LightPlayer(), {
    _addMods: function () {
        this.add( new Header() );
        this.add( new InfoNovelas() );
        this.add( new SocialNovelas() );
        this.add( new Stage() );
        this.add( new PlaylistNovelas() );
    }
});



function InfoNovelas() {}

InfoNovelas.prototype = $.extend( new Info(), {
    _render: function () {
        var item = this._getItem( 'current' );

        this.domRoot = $( [
            '<div class="info">',
                '<span class="contador">',
                    'cena <span class="numero">1</span> de <span class="numero">23</span>',
                '</span>',
                '<h6>'+item.title+'</h6>',
            '</div>'
        ].join( '' ) );
    },

    _updateItem: function () {
        var item = this._getItem( 'current' );

        this.domRoot.find( 'h6' ).text( item.title );
    }
});



function SocialNovelas() {}

SocialNovelas.prototype = $.extend( new Social(), {
    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="social">',
                '<span class="label">compartilhe esse vídeo</span>',
            '</div>'
        ].join( '' ) );
    },

    _renderSocials: function () {
        this._renderTwitterButton();
        this._renderFacebookButton();
        this._renderOrkutButton();
        this._renderFacebookXML();
    },

    _renderFacebookXML: function () {
        //<div class="fb-like fb_edge_widget_with_comment fb_iframe_widget" data-send="false" data-layout="button_count" data-width="150" data-show-faces="false"></div>
    }
});


function PlaylistNovelas() {}

PlaylistNovelas.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'playlist';
        this.bus = bus;
        this.json = json;
        this.offset = 0; 

        this._render();
        this._addEvents();

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
            .delegate( 'a.seta-direita:not(.inativo)', 'click', function () {
                that._goNext();
            })
            .delegate( 'a.seta-esquerda:not(.inativo)', 'click', function () {
                that._goPrev();
            })
            .delegate( 'div.trilho-videos a', 'click', function () {
                var item = that._getItemById( $( this ).attr( 'item-id' ) );

                that._setItemAsCurrent( item );
                that.pub( 'video-change', that.json );

                that._setAsWatching( $( this ).parent() );

                return false;
            });
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
        this.domRoot.find( 'div.trilho-videos' ).css( 'text-indent', this.offset );
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
                '<a class="seta-esquerda"></a>',
                '<div class="trilho-videos"></div>',
                '<a class="seta-direita"></a>',
                '<span class="borda-inferior"></span>',
            '</div>'
        ].join( '' ) );
    },

    _renderItens: function () {
        var html = '<ul>';

        $.each( this.json.itens, function ( i ) {
            html += (i>0 && i%4 === 0? '</ul><ul>':'');
            html += [
                '<li '+(this.current? 'class="assistindo"': '')+'>',
                    '<a href="javascript:;" item-id="'+this.id+'">',
                        '<img src="http://img.video.globo.com/180x108/'+this.id+'.jpg">',
                        '<span class="hover-img"></span>',
                        
                        '<span class="layer"></span>',
                        '<span class="label">assistindo</span>',
                        
                        '<span class="contador-videos">',
                            'cena <span class="numero">1</span> de <span class="numero">23</span>',
                        '</span>',
                        
                        '<span class="titulo-item">'+this.title+'</span>',
                        '<span class="exibicao"><strong>'+this.views+'</strong> exibições</span>',
                    '</a>',
                '</li>',
                '&nbsp;'
            ].join( '' );
        } );

        html += '</ul>';

        this.domRoot.find( 'div.trilho-videos' ).append( html );
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
        this.domRoot.find( 'a.seta-esquerda, a.seta-direita' ).removeClass( 'inativo' );

        if ( this.current.next().size() === 0 ) {
            this.domRoot.find( 'a.seta-direita' ).addClass( 'inativo' );
        }

        if ( this.current.prev().size() === 0 ) {
            this.domRoot.find( 'a.seta-esquerda' ).addClass( 'inativo' );
        }
    }
});

