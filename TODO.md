
# TODO

* Parametrizar host dos thumbs de video
* Colocar funções construtoras debaixo de um mesmo namespace
* Passar parametros para a função construtora do LightPlayer e poder fazer override no open
* Testar edge cases. Ex.: problema com parametros.
* Criar versão BBB do Lightplayer para exemplificar extensão do LightPlayer
* Criar tasks grunt:
    1. grunt test browser   - Rodar testes jasmine no browser
    2. grunt test phantom   - Rodar testes jasmine no phantomjs
    3. grunt doc            - abre documentação
    4. grunt doc --generate - gera documentação
    5. grunt lint           - rodar lint em todo os srcs
    6. grunt concat         - concatenar srcs
    7. grunt min            - contatenar e minificar srcs
    8. grunt deploy         - roda as seguintes tarefas
                                * faz todos os itens acima (pára se conter erros),
                                * versiona:
                                    * atualiza versão do package
                                    * atualiza versão do setup.py
                                    * gera tag no git com versão
                                * pusha para o repositório
    9. grunt help           - mostrar todos os comandos disponíveis
