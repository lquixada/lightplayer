LightPlayer = o.Class({
	open: function ( json ) {
		// Barramento principal pela qual todos os modulos se comunicam
		this.bus	= new o.Event();
		this.json = json;

		this._render();
		this._addMods();
		this._addListeners();
		
		this._animateIn( this.json.onOpen );
	},

	close: function () {
		var that = this;

		this._animateOut( function () {
			that.domRoot.remove(); 
		});

		$( document ).unbind( 'keydown.lightplayer' );
	},

	add: function ( mod ) {
		this.domRoot.find( 'div.widget' ).append( mod.domRoot ); 
	},

	// private

	_addListeners: function () {
		var that = this;

		this.bus.on( 'lightplayer-close', function () {
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
		var json = $.extend( true, {}, this.json );

		this.add( new Header(this.bus, json) );
		this.add( new Info(this.bus, json) );
		this.add( new Social(this.bus, json) );
		this.add( new Stage(this.bus, json) );
		this.add( new Playlist(this.bus, json) );
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

				that.bus.fire( 'lightplayer-opened' );

				if ( callback ) {
					callback.call( that );
				}

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
			
			this.bus.fire( 'lightplayer-opened' );
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
		if ( $.browser.webkit || $.browser.chrome ) {
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
});


jQuery.lightplayer = {
	_instance: new LightPlayer(),

	open: function ( options ) {
		this._instance.open( options );
	},

	close: function () {
		this._instance.close();
	}
};


jQuery.extend( jQuery.easing, {
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
		}
	}
});


PubSub = o.Class({
	pub: function ( eventName, json ) {
		this.bus.fire(eventName, {
			origin: this.name,
			// Create a deep copy of json object
			json: $.extend(true, {}, json)
		});
	},

	sub: function ( eventName, callback ) {
		var that = this;

		this.bus.on(eventName, function (evt, data) {
			if ( data.origin !== that.name ) {
				callback( evt, data );
			}
		});
	}
});


ItensManager = o.Class({
	extend: PubSub,

	_getItem: function ( position ) {
		var chosen,
			itens = this.json.itens,
			choose = function ( i ) {
				if ( position === 'current' ) { return itens[i];	 }
				if ( position === 'next' ) {	return itens[i+1]; }
				if ( position === 'prev' ) {	return itens[i-1]; }
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
	}
});


Mod = o.Class({
	extend: ItensManager,

	/**
	 * Inicializa o módulo com o barramento e o json
	 *
	 * @method init
	 * @param bus {Object} O barramento com o qual o módulo vai se comunicar
	 * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
	 * @return {Object} O nó raiz da subárvore DOM do módulo
	 */
	init: function ( bus, json ) {
		this.name = 'mod-name';
		this.bus = bus;
		this.json = json;

		this._render();
		this._addListeners();
		
		return this.domRoot;
	},

	truncate: function ( str, count ) {
		var cutIndex;

		if ( !str ) {
			return str;
		}

		if ( str.length > count ) {
			str = str.substring(0, count);
			cutIndex = str.lastIndexOf(' ');
			return str.substring( 0, cutIndex )+'...';
		}

		return str;
	},

	// private

	_addListeners: function () {
		// Define all events attachments here
	},

	_render: function () {
		// Create all the DOM subtree here
		// And then assign the root to this.domRoot
	}
});
