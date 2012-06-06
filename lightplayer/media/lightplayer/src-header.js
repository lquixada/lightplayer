
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

