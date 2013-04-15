Info = o.Class({
	extend: Mod,
	/**
	 * Inicializa o módulo com o barramento e o json
	 *
	 * @method init
	 * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
	 * @return {Object} O nó raiz da subárvore DOM do módulo
	 */
	init: function ( json ) {
		this.name = 'info';
		this.client = new LiteMQ.Client({name:this.name});
		this.json = json;

		this._render();
		this._addListeners();
		
		return this.domRoot;
	},

	// private

	_addListeners: function () {
		var that = this;

		this.client.sub( 'video-change', function ( msg ) {
			that.json = msg.body;
			that._updateItem();
			//debugger;
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

