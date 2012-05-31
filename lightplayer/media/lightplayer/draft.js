LightPlayer = function () {};

LightPlayer.prototype = {
    add: function ( mod ) {
        this.widget.append( mod.init() );
    },

    addBlocks: function () {
        this.add( new Header( this.bus, this.json ) );
        this.add( new VideoTitle( this.bus, this.json ) );
        this.add( new Social( this.bus, this.json ) );
        this.add( new Stage( this.bus, this.json ) );
        this.add( new Playlist( this.bus, this.json ) );
        this.add( new Comments( this.bus, this.json ) );
    },

    open: function ( json ) {
        this.json = json;
        this.bus = $({});

        this.renderContainer();
        this.addBlocks();
        this.animateIn();
    }
};


/***********************************************
 * EXEMPLO DE MODULO: STAGE
 ***********************************************/

// A FUNCAO CONSTRUTORA RECEBERA UM BARRAMENTO E O JSON COM OS VIDEOS
Stage = function ( bus, json ) {
    this.bus = bus;
    this.json = json;
};

Stage.prototype = {
    // CHAMADO QUANDO MODULO EH ADICIONADO AO LIGHTPLAYER
    init: function () {
        this.block = this.render( json );
        this.addEvents();
        
        // DEVE RETORNA O NOH RAIZ DO HTML DO MODULO
        return this.block;
    },

    addEvents: function () {
        // SETA TODOS OS EVENTOS DO MODULO
    },

    render: function () {
        // TRANSFORMA JSON EM HTML VIA TEMPLATE OU JAVASCRIPT
    }
};

lightplayer1 = new LightPlayer();
lightplayer1.open({});
