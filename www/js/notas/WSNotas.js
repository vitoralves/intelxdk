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
        //console.log(WebService.Request('NotaWS', 'getMatriculasPorPessoa', [vm.matricula]));
        /**
         * O método Request recebe o serviço, o método a ser executado
         * e um array com os parâmetros a serem passados para o método
         * A ordem dos parâmetros deve ser respeitada de acordo com o WebService
         */
        WebService.Request('NotaWS', 'getMatriculasPorPessoa', [vm.matricula])
            .then(function (dados) {
				console.info('dados '+dados);
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