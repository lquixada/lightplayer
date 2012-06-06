
LightPlayer = function () {};

LightPlayer.prototype = {
    open: function ( json ) {
        var that = this;

        $( document ).trigger( 'modal-opened.lightplayer' );

        // Barramento principal pela qual todos os modulos se comunicam
        this.bus  = $( {} );
        this.json = json;

        this.div = this._renderModal( json );
        this.ul  = this.div.find( 'ul' );

        this.justOpened = true;

        if ( json.htmlClass ) {
            this.div.addClass( this.json.htmlClass );
        }

        //this.navigation.init( {
            //container: this.div.find( 'div.widget-content' )
        //} );

        this._addMods();
        this._addEvents();

        this._animateIn( function () {
            //var list = $.isArray( json )? json: json.list;
            
            //that._appendItens( list );
            //that._selectCurrent( list );
            //that._bindEvents();
        } );
    },

    close: function () {
        var that = this;

        $( document ).trigger( 'modal-closed.lightplayer' );
        
        this._removePlayers();

        this._animateOut( function () {
            that.div.remove(); 
        });

        $( document ).unbind( 'keydown.lightplayer' );
    },

    add: function ( mod ) {
        var json = $.extend( true, {}, this.json );
        this.div.find( 'div.widget' ).append( mod.init( this.bus, json ) ); 
    },

    // private
    
    _addMods: function () {
        this.add( new Header() );
        this.add( new Stage() );
        this.add( new Info() );
        this.add( new Social() );
    },

    _addEvents: function () {
        var that = this;

        this.bus.bind( 'lightplayer-close', function () {
            that.close();
        } );

        this.div.delegate( 'div.widget-container', 'click', function ( evt ) {
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


    _animateIn: function ( callback ) {
        var that = this,
            onTransitionEnd = this._getTransitionEndEvent(),
            divOverlay = this.div.find( 'div.widget-overlay' ),
            divWidget = that.div.find( 'div.widget' );

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

        // Bugfix: transition doesn't work when element is immediatelly added to the DOM
        setTimeout( function () {
            
            divOverlay.addClass( 'visible' );
            
            // For browsers (IEs and FF3.6) that doesn't support css3 animations, just call the callback
            if ( !that._hasTransitionSupport() ) {
                divWidget.css( '-moz-transform', 'none' );
                divWidget.addClass( 'visible' );
                
                callback();
            }
        }, 250);
    },

    _animateOut: function ( callback ) {
        var that = this,
            onTransitionEnd = this._getTransitionEndEvent(),
            divOverlay = this.div.find( 'div.widget-overlay' ),
            divWidget = this.div.find( 'div.widget' );

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

    _appendItens: function ( list ) {
        var lis = this._jquerifyList( list );

        this.ul.append( lis );
    },
    
    _go: function ( directionClass ) {
        var li = this.div.find( 'li.'+directionClass );
        this._show( li );
    },

    _goNext: function () {
        this._go( 'next' );
    },

    _goPrev: function () {
        this._go( 'prev' );
    },

    _bindEvents: function () {
        var that = this;

        this.div.delegate( 'a.close, div.widget-container', 'click', function ( event ) {
                if ( event.target == this ) {
                    that.close();
                }
            } )
            .delegate( 'a.prev.visible:not(.loading)', 'click', function () {
                that._goPrev();

                $( document ).trigger( 'button-prev-clicked.lightplayer' );
            } )
            .delegate( 'a.next.visible:not(.loading)', 'click', function () {
                that._goNext();

                $( document ).trigger( 'button-next-clicked.lightplayer' );
            } )
            .delegate( 'a.nav:not(.loading)', 'mouseenter', function () {
                var a = $( this );
                
                // Show arrow
                a.stop().find( 'span.arrow' ).fadeTo( 250, 1 );

                // First open box
                a.stop().animate( { width: 245 }, 250, function () {
                    // Then show info
                    a.find( 'span.video' ).fadeIn();
                } );
            } )
            .delegate( 'a.nav:not(.loading)', 'mouseleave', function () {
                var a = $( this );
                
                // Hide arrow
                a.stop().find( 'span.arrow' ).fadeTo( 250, 0.2 );

                // First hide info
                a.stop().find( 'span.video' ).fadeOut( 300, function () {
                    // Then close box
                    a.stop().animate( { width: 0 }, 250 );
                });
            } )
            .delegate( 'input', 'click', function () {
                $( this ).select();
            });

        $( document ).bind( 'keydown.lightplayer', function ( evt ) {
            switch ( evt.which ) {
                case 27: /* ESC key */
                    that.close(); break;
                case 37: /* LEFT key */
                    that.div.find( 'a.prev.visible' ).click(); break;
                case 39: /* RIGHT key */
                    that.div.find( 'a.next.visible' ).click(); break;
            }
        } );
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

    _getJson: function ( item ) {
        var json = item.data( 'json' );

        return json? json: {};
    },

    _getMore: function ( item ) {
        var that = this,
            nextUrl = this.ul.data( 'next-page' ),
            prevUrl = this.ul.data( 'prev-page' );
        
        if ( item.is( ':first-child' ) && prevUrl ) {
            //this.navigation.spin( 'prevButton' );
            
            $.getJSON( prevUrl, function ( json ) {
                var current = that.div.find( 'li.current' );

                that.ul.data( 'prev-page', json.prevPage );

                that._prependItens( json.list );
                that._setCurrent( current );

                //that.navigation._updateInfo( {
                    //prevJson: that._getJson( current.prev() ),
                    //nextJson: that._getJson( current.next() )
                //} );

                //that.navigation.stop( 'prevButton' );
            } );
        }

        if ( item.is( ':last-child' ) && nextUrl ) {
            //this.navigation.spin( 'nextButton' );
            
            $.getJSON( nextUrl, function ( json ) {
                var current = that.div.find( 'li.current' );

                that.ul.data( 'next-page', json.nextPage );

                that._appendItens( json.list );
                that._setCurrent( current );
                //that.navigation._updateInfo( {
                    //prevJson: that._getJson( current.prev() ),
                    //nextJson: that._getJson( current.next() )
                //} );

                //that.navigation.stop( 'nextButton' );
            } );
        }
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

    _jquerifyList: function ( list ) {
        var li, lis = $( [] ); // Empty jQuery set

        $.each( list, function () {
            li = $( '<li><div class="video-player" data-player-videosIDs="'+this.id+'"></div></li>' );
            li.data( 'json', this );
            lis = lis.add( li );
        });

        return lis;
    },

    _prependItens: function ( list ) {
        var lis = this._jquerifyList( list );

        this.ul.prepend( lis );
    },
    
    _removePlayers: function () {
        this.div.find( 'div.video-player' ).empty();
    },

    _renderModal: function ( json ) {
        var divlightplayer, html = $( 'script#lightplayer-template' ).html();

        divlightplayer = $( html );
        divlightplayer.find( 'ul' ).data( {
            'prev-page': json.prevPage,
            'next-page': json.nextPage
        });
        divlightplayer.appendTo( 'body' );

        return divlightplayer;
    },

    _selectCurrent: function ( list ) {
        var chosen = 0; // Choose the first item by default

        $.each( list, function ( i ) {
            if ( this.current ) {
                chosen = i;
            }
        });
        
        this._show( this.div.find( 'li' ).eq( chosen ) );
    },

    _setCurrent: function ( item ) {
        this.div.find( 'li' ).removeAttr( 'class' );

        item.addClass( 'current' )
            .next().addClass( 'next' ).end()
            .prev().addClass( 'prev' );
    },

    _show: function ( item ) {
        // Item
        this._setCurrent( item );
        this._updateInfo( item );

        // Nav buttons
        //this.navigation._toggle( {
            //itemIndex: item.index(),
            //itensTotal: item.siblings().size()+1
        //} );

        //this.navigation._updateInfo( {
            //prevJson: this._getJson( item.prev() ),
            //nextJson: this._getJson( item.next() )
        //} );

        // Pagination
        this._getMore( item );
    },

    _updateInfo: function ( item ) {
        var json = this._getJson( item );

        this.div.find( 'div.video-info' )
            .hide()
            .find( 'h6' ).html( json.title || '' ).end()
            .find( 'span.views' ).html( json.views + ' exibições' ).end()
            .find( 'p' ).html( json.description || '' ).end()
            .stop( true, true )
            .fadeIn()
    }
};


//LightPlayer.Navigation = function () {};
//LightPlayer.Navigation.prototype = {
    //init: function ( options ) {
        //this.div   = options.container;
        //this.aNext = this.div.find( 'a.nav.next' );
        //this.aPrev = this.div.find( 'a.nav.prev' );
    //},
    
    //spin: function ( button ) {
        //if ( button == 'nextButton' ) {
            //this.aNext.addClass( 'visible loading' ); 
        //} else {
            //this.aPrev.addClass( 'visible loading' ); 
        //}
    //},

    //stop: function ( button ) {
      //if ( button == 'nextButton' ) {
          //this.aNext.removeClass( 'loading' ); 
      //} else {
          //this.aPrev.removeClass( 'loading' ); 
      //}
    //},

    //// private
    
    //_toggle: function ( options ) {
        //var isOnlyChild = options.itensTotal === 1,
            //isFirstChild = options.itemIndex === 0,
            //isLastChild = options.itemIndex == options.itensTotal-1;

        //this.div.find( 'a.nav' ).removeClass( 'visible' );

        //if ( isOnlyChild ) {
            //return;
        //}

        //if ( isFirstChild ) {
            //this.aNext.addClass( 'visible' );
        //} else if ( isLastChild ) {
            //this.aPrev.addClass( 'visible' );
        //} else {
            //this.aNext.addClass( 'visible' );
            //this.aPrev.addClass( 'visible' );
        //}

        //// Bugfix: ghost text showing when getting to the edges.
        //this.div.find( 'a.nav:not(.visible) span.video' ).removeAttr( 'style' );
    //},

    //_updateInfo: function ( options ) {
        //this.aPrev.find( 'span.title' ).text( options.prevJson.title );
        //this.aNext.find( 'span.title' ).text( options.nextJson.title );
    //}
//};
