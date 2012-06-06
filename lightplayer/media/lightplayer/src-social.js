
/***********************************************
 * MODULO SOCIAL
 ***********************************************/

Social = function () {};

Social.prototype = {
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

        this.bus.bind( 'video-change', function ( evt ) {
            that.json = evt.json;
            that._update();
        } );
    },

    _clear: function () {
        this.domRoot.html( '' );
    },

    _getItem: function ( position ) {
        var itemChosen, itens = this.json.list,
            choose = function ( i ) {
                if ( position === 'current' ) {  return itens[i];   }
                if ( position === 'next' ) {     return itens[i+1]; }
                if ( position === 'prev' ) {     return itens[i-1]; }
            };
        
        $.each( itens, function ( i ) {
            if ( this.current ) {
                itemChosen = choose( i );
                return false;
            }
        });
        
        return itemChosen || {};
    },

    _render: function () {
        this._renderContainer();
        this._renderSocials();
    },

    _renderSocials: function () {
        this._renderFacebookXML();
        this._renderTwitterButton();
        this._renderFacebookButton();
        this._renderOrkutButton();
        this._renderGloboInput();
    },

    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="social">',
            '</div>'
        ].join( '' ) );
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

    _renderFacebookXML: function () {
        var item = this._getItem( 'current' ),
            span = $( '<span class="facebook"></span>' );
        
        span.append( '<fb:like href="'+item.url+'" send="false" width="240" show_faces="true"></fb:like>' )
            .appendTo( this.domRoot );
        
        facebookParse( span.get(0) ); 
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
        this._renderSocials();
    }
};

