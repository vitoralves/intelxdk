/**************************
    PESQUISA DE MATERIAIS
***************************/
(function () {

    'use strict';

    angular.module('myApp').controller('BiblioPesquisa', BiblioPesquisa);

    /**
     * Injeta a factory WebService no controller
     * Injeta a o service de PesqBiblio que guarda os dados do aluno
     */
    BiblioPesquisa.$inject = ['WebService', '$state', '$ionicHistory', 'PesqBiblio'];

    function BiblioPesquisa(WebService,$state,$ionicHistory,PesqBiblio) {
        var vm = this;

        vm.listaTipoMaterial = PesqBiblio.listaTipoMaterial;
        vm.idTipoMaterial = PesqBiblio.idTipoMaterial;
        vm.titulo = PesqBiblio.titulo;
        vm.autor = PesqBiblio.autor;
        vm.assunto = PesqBiblio.assunto;
        PesqBiblio.sensorPesq = 0;
        vm.lgListaTipoMaterial = vm.listaTipoMaterial.length == 0 ? true : false;

        /*
          Caso o usuario esteja nos filtros da biblioteca o sensor e atribuido com zero para
          ao pesquisar fazer uma requisição ao WS
        */

        if(vm.listaTipoMaterial.length == 0){
          /**
           * O método Request recebe o serviço, o método a ser executado
           */
          WebService.Request('BibliotecaWS', 'getTodosMaterialTipo',[])
              .then(function (dados) {
                  PesqBiblio.listaTipoMaterial = [{id: 0, nome: 'TODOS'}].concat(dados);
                  vm.listaTipoMaterial = PesqBiblio.listaTipoMaterial;
                  vm.lgListaTipoMaterial = false;
              });
        }

        vm.gravar = function(){
         /*Aqui verifica se o usuario já realizou essa pesquisa para não
           fazer requisições a todo o momento para o WS*/
         if(PesqBiblio.idTipoMaterial == vm.idTipoMaterial &&
            PesqBiblio.titulo == vm.titulo &&
            PesqBiblio.autor == vm.autor &&
            PesqBiblio.assunto == vm.assunto &&
            PesqBiblio.listaMateriais != undefined ){
              if(PesqBiblio.listaMateriais.length > 0)
                PesqBiblio.sensorPesq = 1;
           }
           else{
              /*Dados da Pesquisa ficam salvas durante a sessão*/
              PesqBiblio.idTipoMaterial = vm.idTipoMaterial;
              PesqBiblio.titulo = vm.titulo;
              PesqBiblio.autor = vm.autor;
              PesqBiblio.assunto = vm.assunto;
            };

          $ionicHistory.nextViewOptions({
           disableAnimate: true,
           disableBack: true,
           historyRoot: false
          });

          $state.go('menu.listaMateriais');
        };

    }

})();

/**************************
    LISTA DE MATERIAIS
***************************/
(function () {

    'use strict';

    angular.module('myApp').controller('BiblioListaMateriais', BiblioListaMateriais);

    /**
     * Injeta a factory WebService no controller
     * Injeta a o service de PesqBiblio que guarda os dados do aluno
     */
    BiblioListaMateriais.$inject = ['WebService', '$ionicPopup', '$timeout', '$state', '$ionicHistory', 'PesqBiblio'];

    function BiblioListaMateriais(WebService, $ionicPopup, $timeout, $state, $ionicHistory, PesqBiblio) {
        var vm = this;

        vm.lgListaMateriais = true;
        vm.listaMateriais = PesqBiblio.listaMateriais;
        PesqBiblio.sensorGeral = 0;
        PesqBiblio.sensorAssuntos = 0;
        PesqBiblio.sensorExemplares = 0;

        //Verificar imagem para a lista de materiais
        switch (PesqBiblio.idTipoMaterial) {
          case '5':
            vm.img = 'imagens/cd.png';
            break;
          case '9':
            vm.img = 'imagens/chave.png';
            break;
          case '6':
            vm.img = 'imagens/disquete.png';
            break;
          case '8':
            vm.img = 'imagens/dvd.png';
            break;
          case '10':
            vm.img = 'imagens/fita.png';
            break;
          case '2':
            vm.img = 'imagens/livro.png';
            break;
          case '3':
            vm.img = 'imagens/monografia.png';
            break;
          case '4':
            vm.img = 'imagens/video.png';
            break;
          case '11':
            vm.img = 'imagens/video-texto.png';
            break;
          default :
            vm.img = 'imagens/todos.png';
        };


        // Caso o usuario esteja em lista e o sensor seje zero e feito uma requisição para WS
         if(PesqBiblio.sensorPesq == 0){

           /*Trata os parametros para a pesquisa*/
           var v_titulo = PesqBiblio.titulo == '' ? '%' : '%' + PesqBiblio.titulo + '%';
           var v_autor = PesqBiblio.autor == '' ? '%' : '%' + PesqBiblio.autor + '%';
           var v_assunto = PesqBiblio.assunto == '' ? '%' : '%' + PesqBiblio.assunto + '%';

           /**
            * O método Request recebe o serviço, o método a ser executado
            * e um array com os parâmetros a serem passados para o método
            * A ordem dos parâmetros deve ser respeitada de acordo com o WebService
            */
           WebService.Request('BibliotecaWS', 'localizarMaterialPorTituloAutorAssunto', [v_titulo,v_autor,v_assunto,PesqBiblio.idTipoMaterial,false])
               .then(function (dados) {
                   PesqBiblio.listaMateriais = dados
                   vm.listaMateriais = PesqBiblio.listaMateriais;

                   //Caso não encontre nenhum material
                   if(vm.listaMateriais == undefined){

                     $ionicHistory.nextViewOptions({
               				disableAnimate: true,
               				disableBack: true,
               				historyRoot: false
               			 });

                     $ionicPopup.alert({
                         title: 'Atenção',
                         template: 'Pesquisa foi realizada, no entanto, a obra não foi localiza.'
                       }).then(function(res){
                         $state.go('menu.biblioteca');
                       });
                  }

                   vm.lgListaMateriais = false;
               });

           /*
           Aqui e atribuido 1 para o sensor para que o app não precise ficar fazendo requisições ao WS
           a todo momento somente quando for realizar uma nova pesquisa
           */
           PesqBiblio.sensorPesq = 1;
         }

         vm.detalhe = function(pIdMaterial,pTtMaterial){

           if(PesqBiblio.idMaterial != pIdMaterial &&
              PesqBiblio.ttMaterial != pTtMaterial){

              PesqBiblio.idMaterial = pIdMaterial;
              PesqBiblio.ttMaterial = pTtMaterial;

           }else{

             if(PesqBiblio.listaAutores.length > 0 &&
               PesqBiblio.ddRetiradaObra != ''){
               PesqBiblio.sensorGeral = 1;
             }

             if(PesqBiblio.listaAssuntos.length > 0){
                 PesqBiblio.sensorAssuntos = 1;
             }

             if(PesqBiblio.listaExemplares.length > 0){
                  PesqBiblio.sensorExemplares = 1;
             }

           }

           $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
            historyRoot: false
           });

           $state.go('menu.detalheMaterial.detalheMaterialGeral');
    }

    $timeout(function(){
      vm.lgListaMateriais = PesqBiblio.sensorPesq == 0 ? true : false;
    }, 250);

}
})();

/*********************************
    DETALHE DE MATERIAL - GERAL
**********************************/
(function () {

    'use strict';

    angular.module('myApp').controller('BiblioDetalheGeral', BiblioDetalheGeral);

    /**
     * Injeta a factory WebService no controller
     * Injeta a o service de PesqBiblio que guarda os dados do aluno
     */
    BiblioDetalheGeral.$inject = ['WebService', 'PesqBiblio'];

    function BiblioDetalheGeral(WebService,PesqBiblio) {
        var vm = this;

        vm.ttMaterial = PesqBiblio.ttMaterial;
        vm.ddRetiradaObra = PesqBiblio.ddRetiradaObra;
        vm.listaAutores = PesqBiblio.listaAutores;
        vm.lgGeral = PesqBiblio.sensorGeral == 0 ? true : false;

        if(PesqBiblio.sensorGeral == 0){

          WebService.Request('BibliotecaWS','getTitulo',[PesqBiblio.idMaterial])
              .then(function (dados) {
                  PesqBiblio.ddRetiradaObra = dados[0] + ' - ' + dados[1];
                  vm.ddRetiradaObra = PesqBiblio.ddRetiradaObra;
              });

          WebService.Request('BibliotecaWS','localizarAutor',[PesqBiblio.idMaterial])
              .then(function (dados) {
                  PesqBiblio.listaAutores = Array.isArray(dados) ? dados : [dados];
                  vm.listaAutores = PesqBiblio.listaAutores;
                  PesqBiblio.sensorGeral = 1;
                  vm.lgGeral = false;
              });
        }
    }

})();

/**************************************
    DETALHE DE MATERIAL - ASSUNTOS
***************************************/
(function () {

    'use strict';

    angular.module('myApp').controller('BiblioDetalheAssuntos', BiblioDetalheAssuntos);

    /**
     * Injeta a factory WebService no controller
     * Injeta a o service de PesqBiblio que guarda os dados do aluno
     */
    BiblioDetalheAssuntos.$inject = ['WebService', 'PesqBiblio'];

    function BiblioDetalheAssuntos(WebService,PesqBiblio) {
        var vm = this;

        vm.listaAssuntos = PesqBiblio.listaAssuntos;
        vm.lgAssuntos = PesqBiblio.sensorAssuntos == 0 ? true : false;

        if(PesqBiblio.sensorAssuntos == 0){

          WebService.Request('BibliotecaWS','localizarAssunto',[PesqBiblio.idMaterial])
              .then(function (dados) {
                  PesqBiblio.listaAssuntos = Array.isArray(dados) ? dados : [dados];
                  vm.listaAssuntos= PesqBiblio.listaAssuntos;
                  PesqBiblio.sensorAssuntos = 1;
                  vm.lgAssuntos = false;
              });
        }

    }

})();

/************************************
    DETALHE DE MATERIAL - EXEMPLARES
*************************************/
(function () {

    'use strict';

    angular.module('myApp').controller('BiblioDetalheExemplares', BiblioDetalheExemplares);

    /**
     * Injeta a factory WebService no controller
     * Injeta a o service de PesqBiblio que guarda os dados do aluno
     */
    BiblioDetalheExemplares.$inject = ['WebService', 'PesqBiblio'];

    function BiblioDetalheExemplares(WebService,PesqBiblio) {
        var vm = this;

        vm.listaExemplares= PesqBiblio.listaExemplares;
        vm.lgExemplares = PesqBiblio.sensorExemplares == 0 ? true : false;

        if(PesqBiblio.sensorExemplares == 0){

          WebService.Request('BibliotecaWS','localizarExemplar',[PesqBiblio.idMaterial])
              .then(function (dados) {
                  PesqBiblio.listaExemplares = Array.isArray(dados) ? dados : [dados];
                  vm.listaExemplares= PesqBiblio.listaExemplares;
                  PesqBiblio.sensorExemplares = 1;
                  vm.lgExemplares = false;
              });
        }
    }

})();
