
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
    * grunt test phantom   - Rodar testes jasmine no phantomjs
    * grunt doc            - abre documentação
    * grunt doc --generate - gera documentação
    * grunt deploy         - roda as seguintes tarefas
                                * faz todos os itens acima (pára se conter erros),
                                * versiona:
                                    * atualiza versão do package
                                    * atualiza versão do setup.py
                                    * gera tag no git com versão
                                * pusha para o repositório
    * grunt version        - mostrar versão do lightplayer
    * grunt version 1.0    - seta versão do player
                                * criauma tag do git
                                * altera a versão no setup.py
    * grunt help           - mostrar todos os comandos disponíveis
