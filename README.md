# README

## Instalação

Rode o comando abaixo para instalar a app.

    $ pip install lightplayer --extra-index-url=http://ipypi.globoi.com/simple/

Na página em que o lightplayer vai rodar, adicionar as tags:

    <link href="/media/lightplayer/build/src.css" rel="stylesheet" />

    <script src="/media/lightplayer/build/src.js"></script>

## Uso

### QuickStart

Para ver o LightPlayer funcionando rapidamente na sua página, o set mais básico
é o seguinte:

```
var lightplayer = new LightPlayer();

lightplayer.open( {
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
```


### Parâmetros

O LightPlayer permite vários níveis de customização. Veja a seguir vários deles.

```
var lightplayer = new LightPlayer();

lightplayer.open( {
  /*
   * Seta o titulo do lightplayer
   * Default: '<span>mais</span> videos'
   */
  title: 'capítulo de <span>ontem</span>',

  /*
   * Seta o subtitulo do lightplayer
   * Default: ''
   */
  subtitle: 'ter 24',
  
  /*
   * Adiciona uma classe extra ao div raiz do lightplayer
   * Default: ''
   */
  htmlClass: 'bbb',

  /*
   * Indica a dimensão dos videos no lightplayer.
   * Default: 'sd'
   * Valores: 'sd' (480x360) ou 'hd' (640x360)
   */
  mode: 'hd',
  
  /*
   * Sitepage que será repassado para os videos
   * Default: ''
   */
  sitePage: 'exemplo/bbb',

  /*
   * Indica se o video vai ser tocado automaticamente ao
   * abrir o lightplayer, ao navegar no palco ou no clique
   * da playlist.
   * Default: false
   */
  autoPlay: true,

  /*
   * Indica se, ao término do video, o próximo vídeo da lista
   * será tocado automaticamente.
   * Default: false
   */
  autoNext: true,

  /*
   * Indica a partir de qual host que o LightPlayer vai exibir
   * os thumbs da playlist.
   * Default: 'http://img.video.globoi.com'
   */
  thumbHost: 'http://img.video.qa01.globoi.com',

  /*
   * Lista com todas as informações de todos os videos que
   * irão constar na playlist. Se houver só um, a playlista não
   * aparece.
   * Parâmetro obrigatório
   */
  itens: [
      {
          /*
           * Id do video. Serve tanto para embedar o player, como para
           * exibir seu thumb na playlist
           */
          id: 1673168,

          /*
           * Chapeu que aparecerar acima do titulo do vídeo tanto na
           * playlist como acima do palco
           */
          hat: 'cena <span class="numero">1</span> de <span class="numero">23</span>',

          /*
           * Titulo do vídeo
           */
          title: 'Maurício anuncia os últimos dias de inscrições para o BBB12',

          /*
           * Não aparece em lugar nenhum (por ora)
           */
          description: 'O ex-BBB alerta os condidatos para os últimos momentos das inscrições',

          /*
           * Url que servirá para fins de compartilhamento
           */
          url: 'http://www.globo.com',

          /*
           * Se uma url encurtada for fornecida, essa será preferida
           * para fins de compartilhamento
           */
          shortUrl: 'http://bit.ly/HGhkj',

          /*
           * Quantidade de visualizações que o video obteve
           */
          views: 3412,

          /*
           * Indica que este video será o primeiro que será exibido no lightplayer
           */
          current: true
      },
      {
          id: 1606199,
          hat: 'cena <span class="numero">2</span> de <span class="numero">23</span>',
          title: 'Maria dá dicas para quem quer se inscrever no BBB12',
          description: 'A vencedora do BBB11 conta que se inscreveu mais de uma vez e revela por que não desistiu de entrar no programa.',
          url: 'http://www.globo.com',
          views: 39389,
          shortUrl: 'glo.bo/qwe',
          current: true
      }
  ]
} );

/*
 * Fecha o lightplayer
 */
lightplayer.close();
```

Para ver o funcionamento do lightplayer, rode os testes, veja o
código no runner.html e clique nos botões da tela.


### Estendendo o LightPlayer

O LightPlayer é um plugin extensível e modularizado. Isso significa que você pode
customizá-lo de acordo com as necessidades do seu produto, tanto de visual quanto
de funcionalidade. Vamos ver um exemplo de como isso acontece.

Suponha que o seu PO quer um LightPlayer específico para o BBB. Nele, além da
personalização visual, ele quer incluir um banner wide. Para isso, estenda o
LightPlayer, crie um módulo novo e adicione no LightPlayer.

Primeiro instale o widget no seu projeto e inclua os arquivos na sua página.
Agora crie o módulo do Banner.

```
BannerBBB = function () {};

BannerBBB.prototype = $.extend( new Mod(), {
    init: function ( bus, json ) {
        this.name = 'banner-bbb';
        this.bus = bus;
        this.json = json;

        this._render();
        this._addEvents();
        
        return this.domRoot;
    },

    // private

    _addEvents: function () {
        // não tem
    },

    _render: function () {
        this.domRoot = $( [
            '<div class="banner">',
                '<img src="http://www.placehold.it/770x100" style="margin:0 20px 20px;" />',
            '</div>'
        ].join( '' ) ); 
    }
} );
```

Depois estenda e sobrescreva o método do LightPlayer que adiciona todos
os módulos. 

```
LightPlayerBBB = function () {};

LightPlayerBBB.prototype = $.extend( new LightPlayer(), {
    _addMods: function () {
        this.add( new Header() );
        this.add( new Info() );
        this.add( new Social() );
        this.add( new Banner() );
        this.add( new Stage() );
        this.add( new Playlist() );
    },
} );
```

E adicione o modulo novo:

```
LightPlayerBBB = function () {};

LightPlayerBBB.prototype = $.extend( new LightPlayer(), {
    _addMods: function () {
        this.add( new Header() );
        this.add( new Info() );
        this.add( new Social() );
        this.add( new BannerBBB() ); // <-- aqui ó!
        this.add( new Stage() );
        this.add( new Playlist() );
    },
} );
```

Isso vai fazer com que o html do banner seja inserido logo após o
módulo Social! Faça o teste:

```
var lightplayer = new LightPlayerBBB();

lightplayer.open( {
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
```


### Interface jQuery

Para você, meu amigo, que é preguiçoso (e de mau gosto, diga-se de passagem),
existe a opção de usar a interface jquery também. Neste formato, você só
precisa passar para o método $.lightplayer.open() o mesmo json que você
passaria para o lightplayer.open do exemplo anterior.

Neste caso, você não precisa fazer a instanciação. Isso é feito internamente.

```
$.lightplayer.open( {
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
```

Para fechar, o sistema é o mesmo.

```
$.lightplayer.close();
```

Note que, nesse caso, sempre que você chamar $.lightplayer.open(), a mesma
instância de LightPlayer() será utilizada.


## Desenvolvimento

Todos os comandos abaixo devem ser rodados no root do projeto, ou seja,
no mesmo diretorio do arquivo grunt.js.


### Instalação

O projeto precisa de alguns pacotes para instalar as ferramentas de
desenvolvimento. Antes de instalá-los, certifique-se de que você tenha
o nodejs e o npm mais atualizados.

    $ sudo brew install node
    $ curl https://npmjs.org/install.sh | sh

Para instalar as ferramentas, basta para rodar no root do projeto:

    $ npm install grunt grunt-css


### Testes

Para rodar os testes jasmine no browser

    $ grunt jasmine-browser

Se o browser não carregar de primero, dê reload para dar tempo
do servidor rodar.

Para rodar os testes jasmine no phantom:

    $ grunt jasmine-phantom


### Build

Quando terminar o desenvolvimento, é preciso buildar o projeto.

    $ grunt build

Esse comando executa várias operações na seqüência:

    1. Roda testes jasmine com phantomjs
    2. Linta:
        * Javascripts
    3. Concatena:
        * Javascripts em src.js
        * Stylesheets em src.css
    4. Minifica:
        * src.js em min.js
        * src.css em min.css
    5. Joga:
        * src.js e min.js em build/
        * src.css e min.css em build/

Caso haja algum problema em qualquer ponto, o processo é
interrompido.


### Ajuda

Se precisar de ajuda, rode

    $ grunt --help

Isso listará todas as tasks disponíveis.
