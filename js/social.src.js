Social = o.Class({
	extend: Mod,
	/**
	 * Inicializa o Social com o barramento e o json
	 *
	 * @method init
	 * @param bus {Object} O barramento com o qual o módulo vai se comunicar
	 * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
	 * @return {Object} O nó raiz da subárvore DOM do módulo
	 */
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
			'<span class="label">compartilhe este vídeo</span>'
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
