Header = o.clazz({
		extend: Mod,
    /**
     * Inicializa o Header com o barramento e o json
     *
     * @method boot
     * @param bus {Object} O barramento com o qual o módulo vai se comunicar
     * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
     * @return {Object} O nó raiz da subárvore DOM do módulo
     */
    boot: function ( bus, json ) {
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
