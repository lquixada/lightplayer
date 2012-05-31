LightPlayer = function () {};

LightPlayer.prototype = {
    add: function ( mod ) {
        this.widget.append( mod.init() );
    },

    addBlocks: function () {
        this.add( new LightPlayer.header( this.bus, this.json ) );
        this.add( new LightPlayer.title( this.bus, this.json ) );
        this.add( new LightPlayer.social( this.bus, this.json ) );
        this.add( new LightPlayer.stage( this.bus, this.json ) );
        this.add( new LightPlayer.playlist( this.bus, this.json ) );
        this.add( new LightPlayer.comments( this.bus, this.json ) );
    },

    open: function ( json ) {
        this.json = json;
        this.bus = $({});

        this.renderContainer();
        this.addBlocks();
        this.animateIn();
    }
};

LightPlayer.stage = function ( bus, json ) {
    this.bus = bus;
    this.json = json;
};

LightPlayer.stage.prototype = {
    init: function () {
        this.block = this.render( json );
        this.addEvents();

        return this.block;
    },

    addEvents: function () {
        var that = this;

        this.block.delegate( 'a', 'click', function () {
            that.bus.publish( 'event', {} );

        } );

        this.bus.subscribe( 'event', function ( json ) {
            
        } );
    },

    render: function ( json ) {
        var tmpl = [
                '<div class="header">',
                    '<h5>', json.title,'</h5>',
                    '<em class="subtitulo">', json.subtitle, '</em>',
                    '<a href="javascript:;" class="close">fechar</a>',
                '</div>'
            ].join();

        this.block = $( tmpl );
        this.widget.append( this.block );
    }
};

lightplayer1 = new LightPlayer();
lightplayer1.open({});
