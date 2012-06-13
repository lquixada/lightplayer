
LightPlayer = function () {};

LightPlayer.prototype = {
    open: function ( json ) {
        // Barramento principal pela qual todos os modulos se comunicam
        this.bus  = $( {} );
        this.json = json;

        this._render();
        this._addMods();
        this._addEvents();
        
        this._animateIn();
    },

    close: function () {
        var that = this;

        this._animateOut( function () {
            that.domRoot.remove(); 
        });

        $( document ).unbind( 'keydown.lightplayer' );
    },

    add: function ( mod ) {
        var json = $.extend( true, {}, this.json );

        this.domRoot.find( 'div.widget' ).append( mod.init( this.bus, json ) ); 
    },

    // private

    _addEvents: function () {
        var that = this;

        this.bus.bind( 'lightplayer-close', function () {
            that.close();
        } );

        this.domRoot.delegate( 'div.widget-container', 'click', function ( evt ) {
            if ( evt.target === this ) {
                that.close();
            }
        } );

        $( document ).bind( 'keydown.lightplayer', function ( evt ) {
            if ( evt.which === 27 ) {
                that.close();
            }
        } );
    },
    
    _addMods: function () {
        this.add( new Header() );
        this.add( new Info() );
        this.add( new Social() );
        this.add( new Stage() );
        this.add( new Playlist() );
    },

    _animateIn: function () {
        var that = this,
            onTransitionEnd = this._getTransitionEndEvent(),
            divOverlay = this.domRoot.find( 'div.widget-overlay' ),
            divWidget = this.domRoot.find( 'div.widget' );

        this._disablePageScroll();

        divOverlay.bind( onTransitionEnd, function () {
            divWidget.bind( onTransitionEnd, function () {
                /* Firefox bugfix: Flash + css transform doesn't get along very well */
                divWidget.css( '-moz-transform', 'none' );

                that.bus.trigger( 'lightplayer-opened' );

                divWidget.unbind( onTransitionEnd );
            } );

            divWidget.addClass( 'visible' );
            
            divOverlay.unbind( onTransitionEnd );
        } );
        
        // CSS3 has problems with recentlya added dom elements
        // Needs to call .width() to force reflow.
        divOverlay.width();
        divOverlay.addClass( 'visible' );
        
        // For browsers (IEs and FF3.6) that doesn't support css3 animations, just call the callback
        if ( !that._hasTransitionSupport() ) {
            divWidget.css( '-moz-transform', 'none' );
            divWidget.addClass( 'visible' );
            
            this.bus.trigger( 'lightplayer-opened' );
        }
    },

    _animateOut: function ( callback ) {
        var that = this,
            onTransitionEnd = this._getTransitionEndEvent(),
            divOverlay = this.domRoot.find( 'div.widget-overlay' ),
            divWidget = this.domRoot.find( 'div.widget' );

        divWidget.bind( onTransitionEnd, function () {
            divOverlay.bind( onTransitionEnd, function () {
                callback();
                that._enablePageScroll();
            });

            divOverlay.removeClass( 'visible' );
        } );

        // Firefox: remove bugfix
        divWidget.css( '-moz-transform', '' );

        // For browsers (IEs and FF3.6) that doesn't support css3 animations, just call the callback
        if ( !this._hasTransitionSupport() ) {
            callback();
            this._enablePageScroll();
        }

        divWidget.removeClass( 'visible' );
    },

    _disablePageScroll: function () {
        if ( $.browser.msie && $.browser.version < 8 ) {
            $( 'html' ).css( 'overflow', 'hidden' );
        }

        $( 'body' ).css( {
            overflow: 'hidden',
            paddingRight: '15px'
        });
    },

    _enablePageScroll: function () {
        if ( $.browser.msie && $.browser.version < 8 ) {
            $( 'html' ).css( 'overflow', '' );
        }

        $( 'body' ).css( {
            overflow: '',
            paddingRight: ''
        });
    },

    _getTransitionEndEvent: function () {
        if ( $.browser.webkit ) {
            return 'webkitTransitionEnd';
        }
        
        if ( $.browser.opera ) {
            return 'oTransitionEnd';
        }

        return 'transitionend';
    },

    _hasTransitionSupport: function() {
       var div = document.createElement( 'div' ),
           vendors = 'Khtml Ms O Moz Webkit'.split( ' ' );

       if ( 'transition' in div.style ) {
           return true;
       }
        
       for (var i = 0; i < vendors.length; i++) {
           if ( vendors[i] + 'Transition' in div.style ) {
               return true;
           }
       }

       return false;
    },

    _render: function () {
        var htmlClass = this.json.htmlClass || '';

        this.domRoot = $( [
            '<div class="lightplayer '+htmlClass+'">',
                '<div class="widget-container">',
                    '<div class="widget"></div>',
                    '&nbsp;', // needed for preventing scrollbar flickering
                '</div>',
                '<div class="widget-overlay"></div>',
            '</div>'
        ].join( '' ) );

        this.domRoot.appendTo( 'body' );
    }
};



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

    pub: function ( eventName, json ) {
        this.bus.trigger( {
            type: eventName,
            origin: this.name,
            // Create a deep copy of json object
            json: $.extend(true, {}, json)
        } )
    },

    sub: function ( eventName, callback ) {
        var that = this;

        this.bus.bind( eventName, function ( event ) {
            if ( event.origin !== that.name ) {
                callback( event );
            }
        } );
    },

    truncate: function ( str, count ) {
        var cutIndex;

        if ( str.length > count ) {
            str = str.substring(0, count);
            cutIndex = str.lastIndexOf(' ');
            return str.substring( 0, cutIndex )+'...';
        }

        return str;
    },

    // private

    _addEvents: function () {
        // Define all events attachments here
    },

    _getItem: function ( position ) {
        var chosen,
            itens = this.json.itens,
            choose = function ( i ) {
                if ( position === 'current' ) { return itens[i];   }
                if ( position === 'next' ) {    return itens[i+1]; }
                if ( position === 'prev' ) {    return itens[i-1]; }
            };
        
        $.each( itens, function ( i ) {
            if ( this.current ) {
                chosen = choose( i );
                
                if ( chosen ) {
                    chosen.index = i;
                }

                return false;
            }
        });
        
        return chosen;
    },

    _getItemById: function ( id ) {
        var chosen;

        $.each( this.json.itens, function () {
            if ( parseInt( this.id, 10 ) === parseInt( id, 10 ) ) {
                chosen = this;
                return false;
            }
        });
        
        return chosen;
    },

    _setItemAsCurrent: function ( chosen ) {
        var itens = this.json.itens;

        $.each( itens, function () {
            this.current = false;
        });

        chosen.current = true;
    },

    _render: function () {
        // Create all the DOM subtree here
        // And then assign the root to this.domRoot
    }
};



/***********************************************
 * MODULO HEADER
 ***********************************************/

Header = function () {};

Header.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'header';
        this.bus = bus;
        this.json = json;

        this._render();
        this._addEvents();
        
        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;

        this.domRoot.delegate( 'a.close', 'click', function () {
            that.pub( 'lightplayer-close' );
        });
    },

    _render: function () {
        var title = this.json.title || '<span>mais</span> videos',
            subtitle = this.json.subtitle || '';

        this.domRoot = $( [
            '<div class="header">',
                '<h5>'+title+'</h5>',
                '<em class="subtitulo">'+subtitle+'</em>',
                '<a href="javascript:;" class="close">fechar</a>',
            '</div>'
        ].join( '' ) ); 
    }
});



/***********************************************
 * MODULO STAGE
 ***********************************************/

Stage = function () {};

Stage.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'stage';
        this.bus = bus;
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
                var a = $( this );

                clearInterval( that.timer );
                
                // Show arrow
                a.stop().find( 'span.arrow' ).fadeTo( 250, 1 );

                // First open box
                a.stop().animate( { width: 245 }, 250, function () {
                    // Then show info
                    a.find( 'span.info' ).fadeIn();
                } );
            } )
            .delegate( 'a.nav:not(.loading)', 'mouseleave', function () {
                var a = $( this );
                
                // Hide arrow
                a.stop().find( 'span.arrow' ).fadeTo( 250, 0.2 );

                // First hide info
                a.stop().find( 'span.info' ).fadeOut( 300, function () {
                    // Then close box
                    a.stop().animate( { width: 0 }, 250 );
                });
            } );
        
        $( document ).bind( 'keydown.lightplayer', function ( evt ) {
            /* RIGHT key */
            if ( evt.which === 39 ) {
                that.domRoot.find( 'a.next.visible' ).click();
            }
            
            /* LEFT key */
            if ( evt.which === 37 ) {
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

    _clear: function () {
        this.domRoot.find( 'li.current div.video-player' ).html( '' );
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
                complete: $.proxy( this, "_onVideoCompleted" )
            });
    },

    _onVideoCompleted: function () {
        if ( this.json.autoNext ) {
            this._goNext();
        } else {
            this._startArrowAnimation();
        }
    },

    _animateArrow: function () {
        this.domRoot.find( 'a.nav.next.visible span.arrow' )
            .animate( { right: '25px', opacity: 1 }, 200, function () {
                $( this ).animate( { right:'15px' }, 550, 'easeOutBounce' );
            } );
    },

    _startArrowAnimation: function () {
        this._animateArrow();

        this.timer = setInterval( $.proxy( this, '_animateArrow' ), 1400 );
    },

    _stopArrowAnimation: function () {
        clearInterval( this.timer );
    },

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



/***********************************************
 * MODULO SOCIAL
 ***********************************************/

Social = function () {};

Social.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'social';
        this.bus = bus;
        this.json = json;

        this._render();
        this._addEvents();
        
        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;

        this.sub( 'video-change', function ( evt ) {
            that.json = evt.json;
            that._update();
        } );
    },

    _clear: function () {
        this.domRoot.html( '' );
    },

    _render: function () {
        this._renderContainer();
        this._renderContent();
    },

    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="social">',
            '</div>'
        ].join( '' ) );
    },

    _renderContent: function () {
        this._renderTitle();
        this._renderTwitterButton();
        this._renderFacebookButton();
        this._renderOrkutButton();
    },

    _renderFacebookButton: function () {
        var item = this._getItem( 'current' ),
            url = item.shortUrl || item.url;

        $( '<a></a>', {
            'href': 'http://www.facebook.com/share.php?t='+encodeURIComponent(item.title)+'&u='+encodeURIComponent(url),
            'class': 'facebook button',
            'target': '_blank',
            'title': 'Compartilhe no Facebook'
        }).appendTo( this.domRoot );
    },

    _renderTitle: function () {
        this.domRoot.append( [
            '<span class="label">compartilhe esse vídeo</span>'
        ].join( '' ) );
    },

    _renderOrkutButton: function () {
        var item = this._getItem( 'current' ),
            url = item.shortUrl || item.url;

        $( '<a></a>', {
            'href': 'http://promote.orkut.com/preview?nt=orkut.com&tt='+encodeURI(item.title)+'&cn='+encodeURI(item.description)+'&du='+encodeURIComponent(url)+'&tn='+item.thumbUrl,
            'class': 'orkut button',
            'target': '_blank',
            'title': 'Compartilhe no Orkut'
        }).appendTo( this.domRoot );
    },

    _renderTwitterButton: function () {
        var item = this._getItem( 'current' ),
            url = item.shortUrl || item.url;

        $( '<a></a>', {
            'href': 'http://twitter.com?status='+encodeURIComponent(url+' '+item.title),
            'class': 'twitter button',
            'target': '_blank',
            'title': 'Compartilhe no Twitter'
        }).appendTo( this.domRoot );
    },

    _renderGloboInput: function () {
        var item = this._getItem( 'current' );

        if ( !item.shortUrl ) {
            return;
        }

        $( '<input />', {
            type: 'text',
            value: item.shortUrl,
            readonly: 'readonly',
            'class': 'globo-url'
        }).appendTo( this.domRoot );
    },

    _update: function () {
        var item = this._getItem( 'current' );

        this._clear();
        this._renderContent();
    }
});



/***********************************************
 * MODULO INFO
 ***********************************************/

Info = function () {};

Info.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'info';
        this.bus = bus;
        this.json = json;

        this._render();
        this._addEvents();
        
        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;

        this.sub( 'video-change', function ( evt ) {
            that.json = evt.json;
            that._updateItem();
        } );
    },

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
        var style, item = this._getItem( 'current' );
        
        this.domRoot.find( 'span.chapeu' ).html( item.hat || '' );

        if ( item.title.length > 70 ) {
            style = {
                font: 'bold 18px/20px Arial, sans-serif',
                marginTop: '8px'
            };
        } else {
            style = {
                font: 'bold 24px/26px Arial, sans-serif',
                marginTop: '0px'
            };
        }
        
        this.domRoot.find( 'h6' )
            .css( style )
            .html( this.truncate( item.title, 90 ) );
    }
});

/***********************************************
 * MODULO PLAYLIST
 ***********************************************/

function Playlist() {}

Playlist.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'playlist';
        this.bus = bus;
        this.json = json;
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



/* Lightplayer embeded dependency */

$.extend( jQuery.easing, {
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    }
});
