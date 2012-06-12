function LightPlayerNovelas () {}

LightPlayerNovelas.prototype = $.extend( new LightPlayer(), {
    _addMods: function () {
        this.add( new Header() );
        this.add( new InfoNovelas() );
        this.add( new SocialNovelas() );
        this.add( new StageNovelas() );
        this.add( new PlaylistNovelas() );
    }
});



function InfoNovelas() {}

InfoNovelas.prototype = $.extend( new Info(), {
    _render: function () {
        var item = this._getItem( 'current' );

        this.domRoot = $( [
            '<div class="info">',
                '<span class="chapeu"></span>',
                '<h6></h6>',
            '</div>'
        ].join( '' ) );

        this._updateItem();
    },

    _updateItem: function () {
        var font, item = this._getItem( 'current' );
        
        this.domRoot.find( 'span.chapeu' ).html( item.hat || '' );

        if ( item.title.length > 70 ) {
            font = 'bold 18px/20px Arial, sans-serif';
        } else {
            font = 'bold 24px/26px Arial, sans-serif';
        }
        
        this.domRoot.find( 'h6' )
            .css( 'font', font )
            .html( this.truncate( item.title, 90 ) );
    }
});


function StageNovelas() {}

StageNovelas.prototype = $.extend( new Stage(), {
    _updateNextArrow: function () {
        var item = this._getItem( 'next' ) || {};

        this.domRoot.find( 'a.nav.next' ).addClass( 'visible' )
            .find( 'span.chapeu' ).html( item.hat || '' ).end()
            .find( 'span.titulo' ).text( item.title );
    },

    _updatePrevArrow: function () {
        var item = this._getItem( 'prev' ) || {};

        this.domRoot.find( 'a.nav.prev' ).addClass( 'visible' )
            .find( 'span.chapeu' ).html( item.hat || '' ).end()
            .find( 'span.titulo' ).text( item.title );
    }
});


function SocialNovelas() {}

SocialNovelas.prototype = $.extend( new Social(), {
    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="social"></div>'
        ].join( '' ) );
    },

    _renderContent: function () {
        this._renderTitle();
        this._renderTwitterButton();
        this._renderFacebookButton();
        this._renderOrkutButton();
    },

    _renderTitle: function () {
        this.domRoot.append( [
            '<span class="label">compartilhe esse vídeo</span>'
        ].join( '' ) );
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
                '<a class="nav prev"></a>',
                '<div class="trilho-videos"></div>',
                '<a class="nav next"></a>',
                '<span class="borda-inferior"></span>',
            '</div>'
        ].join( '' ) );
    },

    _renderItens: function () {
        var html = '<ul>', that = this;

        $.each( this.json.itens, function ( i ) {
            html += (i>0 && i%4 === 0? '</ul><ul>':'');
            html += [
                '<li '+(this.current? 'class="assistindo"': '')+'>',
                    '<a href="javascript:;" item-id="'+this.id+'">',
                        '<img src="http://img.video.globo.com/180x108/'+this.id+'.jpg">',
                        '<span class="hover-img"></span>',
                        
                        '<span class="layer"></span>',
                        '<span class="label">assistindo</span>',
                        
                        (this.hat? '<span class="chapeu">'+this.hat+'</span>': ''),
                        
                        '<span class="titulo-item">'+that.truncate(this.title, 50)+'</span>',
                        '<span class="exibicao"><strong>'+this.views+'</strong> exibições</span>',
                    '</a>',
                '</li>'
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
        this.domRoot.find( 'a.nav' ).removeClass( 'inativo' );

        if ( this.current.next().size() === 0 ) {
            this.domRoot.find( 'a.next' ).addClass( 'inativo' );
        }

        if ( this.current.prev().size() === 0 ) {
            this.domRoot.find( 'a.prev' ).addClass( 'inativo' );
        }
    }
});

