function LightPlayerNovelas () {
    
}

LightPlayerNovelas.prototype = $.extend( new LightPlayer(), {
    _addMods: function () {
        this.add( new Header() );
        this.add( new InfoNovelas() );
        this.add( new SocialNovelas() );
        this.add( new Stage() );
    }
});

function InfoNovelas() {}

InfoNovelas.prototype = $.extend( new Info(), {
    _render: function () {
        var item = this._getItem( 'current' );

        this.domRoot = $( [
            '<div class="info">',
                '<span class="contador">',
                    'cena <span class="numero">1</span> de <span class="numero">23</span>',
                '</span>',
                '<h6>'+item.title+'</h6>',
            '</div>'
        ].join( '' ) );
    },

    _updateItem: function () {
        var item = this._getItem( 'current' );

        this.domRoot.find( 'h6' ).text( item.title );
    }
});

function SocialNovelas() {}

SocialNovelas.prototype = $.extend( new Social(), {
    _renderContainer: function () {
        this.domRoot = $( [
            '<div class="social">',
                '<span class="label">compartilhe esse vídeo</span>',
            '</div>'
        ].join( '' ) );
    },

    _renderSocials: function () {
        this._renderTwitterButton();
        this._renderFacebookButton();
        this._renderOrkutButton();
        this._renderFacebookXML();
    },

    _renderFacebookXML: function () {
        //<div class="fb-like fb_edge_widget_with_comment fb_iframe_widget" data-send="false" data-layout="button_count" data-width="150" data-show-faces="false"></div>
    }
});
