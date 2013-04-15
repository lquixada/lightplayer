Header = o.Class({
	extend: Mod,
	/**
	 * Inicializa o Header com o barramento e o json
	 *
	 * @method init
	 * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
	 * @return {Object} O nó raiz da subárvore DOM do módulo
	 */
	init: function ( json ) {
		this.name = 'header';
		this.client = new LiteMQ.Client({name:this.name});
		this.json = json;

		this._render();
		this._addListeners();
		
		return this.domRoot;
	},

	// private

	_addListeners: function () {
		var that = this;
		
		this.domRoot.delegate( 'a.close', 'click', function () {
			that.client.pub( 'lightplayer-close' );
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
