
# TODO

* Colocar no ci (fazer task grunt ci?)
* Criar hook no git para rodar grunt build?
* Colocar funções construtoras debaixo de um mesmo namespace
* Passar parametros para a função construtora do LightPlayer
  e poder fazer override no open().
* Testar edge cases. Ex.: problema com parametros.
* Criar specs para Playlist, ItemManager e PubSub
* Criar versão BBB do Lightplayer para exemplificar extensão
  do LightPlayer no demo/.
* Criar template para gerar estrutura 
* Criar tasks grunt:
    * grunt deploy         - roda as seguintes tarefas
                                * roda grunt build
                                * versiona:
                                    * atualiza versão do setup.py
                                    * gera tag no git com versão
                                * pusha para o repositório
