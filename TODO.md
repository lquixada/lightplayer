
# TODO

* Modularizar CSS
* Colocar funções construtoras debaixo de um mesmo namespace
* Passar parametros para a função construtora do LightPlayer
  e poder fazer override no open().
* Testar edge cases. Ex.: problema com parametros.
* Criar specs para Playlist, ItemManager e PubSub
* Criar versão BBB do Lightplayer para exemplificar extensão
  do LightPlayer no demo/.
* Criar tasks grunt:
    * grunt test browser   - Rodar testes jasmine no browser
    * grunt test phantom   - Rodar testes jasmine no phantomjs
    * grunt doc            - abre documentação
    * grunt doc --generate - gera documentação
    * grunt lint           - rodar lint em todo os srcs
    * grunt concat         - concatenar srcs
    * grunt min            - contatenar e minificar srcs
    * grunt deploy         - roda as seguintes tarefas
                                * faz todos os itens acima (pára se conter erros),
                                * versiona:
                                    * atualiza versão do package
                                    * atualiza versão do setup.py
                                    * gera tag no git com versão
                                * pusha para o repositório
    * grunt help           - mostrar todos os comandos disponíveis
