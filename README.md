# README

## Instalação

Rode o comando abaixo para instalar a app.

    $ pip install lightplayer --extra-index-url=http://ipypi.globoi.com/simple/

Na página em que o lightplayer vai rodar, adicionar as tags:

    <link href="/media/lightplayer/src.css" rel="stylesheet" />

    <script src="/media/lightplayer/src.js"></script>


## Exemplo de uso básico

Inserir um código como o abaixo na sua página ou javascript.

      var lightplayer = new LightPlayer();

      lightplayer.open( {
          title: 'capítulo de <span>ontem</span>',
          subtitle: 'ter 24',
          htmlClass: 'bbb',
          mode: 'sd',
          sitePage: 'exemplo/bbb',
          autoPlay: true,
          autoNext: true,
          itens: [
              {
                  id: 1673168,
                  hat: 'cena <span class="numero">1</span> de <span class="numero">23</span>',
                  title: 'Maurício anuncia os últimos dias de inscrições para o BBB12',
                  description: 'O ex-BBB alerta os condidatos para os últimos momentos das inscrições',
                  url: 'http://www.globo.com',
                  views: 3412
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

Para ver o funcionamento do lightplayer, rode os testes, veja o
código no runner.html e clique nos botões da tela.


## Testes

Para rodar os testes jasmine, execute os seguintes commandos

    $ ./runtests

Se o browser não carregar de primero, dê reload para dar tempo
do servidor rodar.
