


/**
 * @class Header
 * @extends Mod
 * @constructor
 */

Header = function () {};

Header.prototype = $.extend( new Mod(), {
    /**
     * Inicializa o Header com o barramento e o json
     *
     * @method init
     * @param bus {Object} O barramento com o qual o módulo vai se comunicar
     * @param json {Object} O json que o módulo vai utilizar para renderizar e se atualizar
     * @return {Object} O nó raiz da subárvore DOM do módulo
     */
    init: function ( bus, json ) {
        /**
         * @property name
         * @type String
         */
        this.name = 'header';

        /**
         * @property bus
         * @type Object
         */
        this.bus = bus;

        /**
         * @property json
         * @type Object
         */
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
