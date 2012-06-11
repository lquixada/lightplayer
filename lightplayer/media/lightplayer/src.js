
LightPlayer = function () {};

LightPlayer.prototype = {
    open: function ( json ) {
        // Barramento principal pela qual todos os modulos se comunicam
        this.bus  = $( {} );
        this.json = json;

        this._render();
        this._addMods();
        this._addEvents();

        this._animateIn( function () {} );
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
        this.add( new Stage() );
        this.add( new Info() );
        this.add( new Social() );
    },

    _animateIn: function ( callback ) {
        var that = this,
            onTransitionEnd = this._getTransitionEndEvent(),
            divOverlay = this.domRoot.find( 'div.widget-overlay' ),
            divWidget = this.domRoot.find( 'div.widget' );

        this._disablePageScroll();

        divOverlay.bind( onTransitionEnd, function () {
            divWidget.bind( onTransitionEnd, function () {
                /* Firefox bugfix: Flash + css transform doesn't get along very well */
                divWidget.css( '-moz-transform', 'none' );

                callback();

                divWidget.unbind( onTransitionEnd );
            } );

            divWidget.addClass( 'visible' );
            
            divOverlay.unbind( onTransitionEnd );
        } );

        divOverlay.addClass( 'visible' );
        
        // For browsers (IEs and FF3.6) that doesn't support css3 animations, just call the callback
        if ( !that._hasTransitionSupport() ) {
            divWidget.css( '-moz-transform', 'none' );
            divWidget.addClass( 'visible' );
            
            callback();
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
        } else if ( $.browser.opera ) {
            return 'oTransitionEnd';
        } else {
            return 'transitionend';
        }
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

    //_getItemIndex: function ( item ) {
        //var index = -1;

        //$.each( this.json.itens, function ( i ) {
            //if ( this === item ) {
                //index = i;
                //return false;
            //}
        //});
        
        //return index;
    //},

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
            that.bus.trigger( 'lightplayer-close' );
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

        this._render();
        this._addEvents();

        return this.domRoot;
    },

    // private

    _addEvents: function () {
        var that = this;
        
        this.bus.bind( 'video-change', function ( evt ) {
            var current, currentNew, item;

            if ( evt.origin !== that.name ) {
                current = that._getItem( 'current' );

                that.json = evt.json;

                currentNew = that._getItem( 'current' );
                
                if ( currentNew.index < current.index ) {
                    item = that._getItem( 'next' );
                    that._setItemAsCurrent( item );

                    that._goPrev();
                } else {
                    item = that._getItem( 'prev' );
                    that._setItemAsCurrent( item );

                    that._goNext();
                }
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
        
        this._go( 'next' );
        this._updateArrows();
        this._updateItem( item );

        this.bus.trigger( {
            type: 'video-change',
            origin: this.name,
            json: this.json
        } );
    },

    _goPrev: function () {
        var item = this._getItem( 'prev' ) || {};

        this._go( 'prev' );
        this._updateArrows();
        this._updateItem( item );

        this.bus.trigger( {
            type: 'video-change',
            origin: this.name,
            json: this.json
        } );
    },

    _render: function () {
        var item = this._getItem( 'current' ) || {};

        this._renderRoot();
        this._renderArrows();
        this._addItem( 'current' );
        this._updateItem( item );
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

    _updateArrows: function () {
        var first = this.json.itens[0],
            last = this.json.itens[this.json.itens.length-1];

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

    _updateItem: function ( item ) {
        var that = this,
            width = (this.json.mode === 'sd'? 480: 640);

        this.domRoot.find( 'li.current div.video-player' )
            .width( width )
            .player( {
                videosIDs: item.id,
                autoPlay: this.json.autoPlay || false,
                sitePage: this.json.sitePage || '',
                width: width,
                height: 360,
                complete: function () {
                    if ( that.json.autoNext ) {
                        that._goNext();
                    }
                }
            });
    },

    _updateNextArrow: function () {
        var item = this._getItem( 'next' ) || {};

        this.domRoot.find( 'a.nav.next' ).addClass( 'visible' )
            .find( 'span.titulo' ).text( item.title );
    },

    _updatePrevArrow: function () {
        var item = this._getItem( 'prev' ) || {};

        this.domRoot.find( 'a.nav.prev' ).addClass( 'visible' )
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

        this.bus.bind( 'video-change', function ( evt ) {
            that.json = evt.json;
            that._update();
        } );
    },

    _clear: function () {
        this.domRoot.html( '' );
    },

    _render: function () {
        this._renderContainer();
        this._renderSocials();
    },

    _renderSocials: function () {
        this._renderFacebookXML();
        this._renderTwitterButton();
        this._renderFacebookButton();
        this._renderOrkutButton();
        this._renderGloboInput();
    },

    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="social">',
            '</div>'
        ].join( '' ) );
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

    _renderFacebookXML: function () {
        var item = this._getItem( 'current' ),
            span = $( '<span class="facebook"></span>' );
        
        span.append( '<fb:like href="'+item.url+'" send="false" width="240" show_faces="true"></fb:like>' )
            .appendTo( this.domRoot );
        
        facebookParse( span.get(0) ); 
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
        this._renderSocials();
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

        this.bus.bind( 'video-change', function ( evt ) {
            that.json = evt.json;
            that._updateItem();
        } );
    },

    _render: function () {
        var item = this._getItem( 'current' ) || {};

        this.domRoot = $( [
            '<div class="info">',
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
});

