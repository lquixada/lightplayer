
/***********************************************
 * MODULO STAGE
 ***********************************************/

Header = function ( bus, json ) {
    this.bus = bus;
    this.json = json;
};

Header.prototype = {
    init: function () {
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
        this.domRoot = $( [
            '<div class="header">',
                '<h5>'+this.json.title+'</h5>',
                '<em class="subtitulo">'+this.json.subtitle+'</em>',
                '<a href="javascript:;" class="close">fechar</a>',
            '</div>'
        ].join( '' ) ); 
    }

};

