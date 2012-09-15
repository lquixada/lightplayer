
function abrir() {
    var lightplayer = new LightPlayer();

    lightplayer.open( {
        title: 'capítulo de <strong>ontem</strong>',
        subtitle: 'qua 13',
        mode: 'hd',
        itens: [
            {
                id: 1991493,
                hat: 'cena <span class="numero">1</span> de <span class="numero">6</span>',
                title: 'Rosário se emociona com o quartinho reformado por Inácio',
                url: 'http://www.globo.com',
                views: 3412
            },
            {
                id: 1991510,
                hat: 'cena <span class="numero">2</span> de <span class="numero">6</span>',
                title: 'Chega o dia do show das Empreguetes',
                url: 'http://www.globo.com',
                views: 39389,
                shortUrl: 'glo.bo/qwe',
                current: true
            },
            {
                id: 1991564,
                hat: 'cena <span class="numero">3</span> de <span class="numero">6</span>',
                title: 'Tom diz que foi ele quem descobriu as Empreguetes',
                url: 'http://www.globo.com',
                views: 1527
            },
            {
                id: 1991632,
                hat: 'cena <span class="numero">4</span> de <span class="numero">6</span>',
                title: 'Cida, Penha e Rosário são assediadas pelos fãs',
                url: 'http://www.globo.com',
                views: 93920,
                shortUrl: 'glo.bo/qwe'
            },
            {
                id: 1991631,
                hat: 'cena <span class="numero">5</span> de <span class="numero">6</span>',
                title: 'Lygia tenta se entender com Samuel',
                url: 'http://www.globo.com',
                views: 1035
            },
            {
                id: 1991376,
                hat: 'cena <span class="numero">6</span> de <span class="numero">6</span>',
                title: 'Otto fica sabendo que Lygia saiu do escritório de Sarmento',
                url: 'http://www.globo.com',
                views: 937,
                shortUrl: 'glo.bo/qwe'
            }
        ]
    } );
}

function abrir1item() {
    var lightplayer = new LightPlayer();

    lightplayer.open( {
        title: 'capítulo de <strong>ontem</strong>',
        subtitle: 'qua 13',
        mode: 'hd',
        itens: [
            {
                id: 1991493,
                hat: 'cena <span class="numero">1</span> de <span class="numero">6</span>',
                title: 'Rosário se emociona com o quartinho reformado por Inácio',
                url: 'http://www.globo.com',
                views: 3412,
                current: true
            }
        ]
    } );
}


$( document ).ready( function () {
    $( 'body' ).prepend( [
        '<div id="buttons">',
            '<button onclick="abrir()">abrir</button>',
            '<button onclick="abrir1item()">abrir com 1 item</button>',
        '</div>'
    ].join('') );
} );

// Testem

if (location.hash === '#testem') {
    document.write('<'+'script src="/testem.js"></'+'script>')
}
