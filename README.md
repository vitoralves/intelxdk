# Portal do Aluno - Uni-FACEF [ Intel XDK ]

### Requisições ao WebService
Foram criados dois modulos para abstração de requisições no arquivo `www/js/index_init_services.js`. O jQuery não foi utilizado na implementação, somente AngularJS.
```js
    .service('XmlParse', XmlParse)
    .factory('WebService', WebService);
```
O serviço `XmlParse` utiliza uma classe baixada no repositório `https://github.com/abdmob/x2js`.
A classe recebe uma string com marcações xml e retorna um Objeto JSON.

A factory `WebService` foi criada para abstrair as requisições ao WebService.

Abaixo segue o código do controller da tela de notas como exemplo de uso.

```js
(function () {

    'use strict';

    angular.module('myApp').controller('NotasCtrl', NotasCtrl);

    /**
     * Injeta a factory WebService no controller
     * Injeta a dependência '$ionicScrollDelegate' no controller
     * Injeta a o service de Acesso que guarda os dados do aluno
     */
    NotasCtrl.$inject = ['WebService', '$ionicScrollDelegate', 'Acesso'];

    function NotasCtrl(WebService, $ionicScrollDelegate, Acesso) {
        var vm = this;

        vm.matricula = Acesso.dados.pessoa;
        vm.semestre = Acesso.dados.id;
        vm.carregarSemestre = carregarSemestre;
        vm.isLoading = true;
        
        /**
         * O método Request recebe o serviço, o método a ser executado
         * e um array com os parâmetros a serem passados para o método
         * A ordem dos parâmetros deve ser respeitada de acordo com o WebService
         */
        WebService.Request('NotaWS', 'getMatriculasPorPessoa', [vm.matricula])
            .then(function (dados) {
                vm.matriculas = dados.reverse();
                //console.log(vm.matriculas);
            });

        function carregarSemestre() {
            vm.isLoading = true;
            WebService.Request('NotaWS', 'getNotasPorMatricula', [vm.semestre])
                .then(function (dados) {
                    vm.notas = dados;
                    $ionicScrollDelegate.scrollTop();
                })
                .finally(function () {
                    vm.isLoading = false;
                });
        }

        vm.carregarSemestre(vm.semestre);
    }
})();

```
O código Angular foi implementado tentando seguir o Guia de Estilo do Angular 1 `https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md`.

Consulte o arquivo `www/views/notas.html` para ver como o controller foi utilizado.