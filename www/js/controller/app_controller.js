(function () {

	"use strict";

	angular.module("myApp").controller("initCtrl", function ($scope, $state, $ionicModal, $ionicPlatform, $ionicHistory, Acesso) {

		Acesso.getAcesso();

		if (Acesso.dados.logado === false) {
			$state.go('login');
		}

		//Ajustar barra no cabeçalho
		if(ionic.Platform.isIOS()){
			$scope.barHeader = 'bar-header-ios';
		}else{
			$scope.barHeader = 'bar-header-geral';
		}

		$scope.home = "Bem Vindo ao Portal Web do Aluno";
		$scope.nota = "Notas e Faltas";
		$scope.biblioteca = "Biblioteca";
		$scope.financeiro = "Extrato Financeiro";
		$scope.guia = "Guia Acadêmico 2016";
		$scope.calendario = "Calendário de Provas";
		$scope.avaGrad = "AVA Graduação";
		$scope.avaPos = "AVA Pós-Graduação";
		$scope.idMaterial;

		//Modal Versão
		$ionicModal.fromTemplateUrl('modal-versao.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.mdVersao = modal;
		});

		$scope.openModalVersao = function () {
			$scope.mdVersao.show();
		};

		$scope.closeModalVersao = function () {
			$scope.mdVersao.hide();
		};
/*
		//Modal Créditos
		$ionicModal.fromTemplateUrl('modal-creditos.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.mdCreditos = modal;
		});

		$scope.openModalCreditos = function () {
			$scope.mdCreditos.show();
		};

		$scope.closeModalCreditos = function () {
			$scope.mdCreditos.hide();
		};*/

		//Ajustar o botão voltar do hardware do smartphone
		$ionicPlatform.registerBackButtonAction(function (event) {
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true,
				historyRoot: false
			});

			if ($state.is('menu.home')) {
				ionic.Platform.exitApp();
			} else if ($state.is('menu.listaMateriais')) {
				$state.go('menu.biblioteca');
			} else if ($state.is('menu.detalheMaterial.detalheMaterialGeral')) {
				$state.go('menu.listaMateriais');
		  } else if ($state.is('menu.detalheMaterial.detalheMaterialAssuntos')) {
				$state.go('menu.listaMateriais');
			}  else if ($state.is('menu.detalheMaterial.detalheMaterialExemplares')) {
				$state.go('menu.listaMateriais');
			} else {
				$state.go('menu.home');
			}


		}, 101);

		//Deslogar do app
		$scope.sair = function () {
			Acesso.sair();
			$state.go('login');
		}

		/*
		$scope.acessarNotas = function () {
			Acesso.notas();
		}*/

	});

	/**
	 * Login Controller
	 */
	angular.module("myApp").controller("loginCtrl", function ($state, $ionicHistory, $ionicPopup, $ionicPlatform, $ionicLoading, WebService, Acesso) {

		var vm = this;
		vm.usuario = '';
		vm.senha = '';

		//Ajustar o botão voltar do hardware do smartphone
		$ionicPlatform.onHardwareBackButton(function (event) {
			if ($state.is('login')) {
				ionic.Platform.exitApp();
			}
		});

		vm.logou = logou;
		vm.guardaDados = guardaDados;

		function logou() {



			if (vm.usuario.length == '' || vm.senha == '') {

				$ionicPopup.alert({
					title: 'Nenhum campo pode ser deixado em branco.'
				});

			} else {

				$ionicLoading.show({
					template: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>Carregando...'
				});

				WebService.Request('NotaWS', 'isMatriculaValida', [vm.usuario, vm.senha])
					.then(function (response) {
						var res = parseInt(response);

						switch (res) {
							case 0: /** Matrícula irregular */
							$state.go('menu.home');
							/*	$ionicPopup.alert({
									title: 'Matrícula irregular!'
								});*/
								break;
							case 1: /** Dados inválidos */
								$ionicPopup.alert({
									title: 'Dados inválidos!'
								});
								break;
							case 2: /** Usuário e senha corretos */
								vm.guardaDados();
								break;
						}
					})
					.finally(function () {
						$ionicLoading.hide();
					});
			}
		}

		function guardaDados() {
			WebService.Request('NotaWS', 'getMatriculasPorPessoa', [vm.usuario])
				.then(function (response) {
					console.log(response.length);
					if(response.length > 0) {
						var matriculaAtual = response.reverse()[0];
						matriculaAtual.logado = true;
						Acesso.guardaLogin(matriculaAtual);		
					}else{
						var matriculaAtual = response;
						matriculaAtual.logado = true;
						Acesso.guardaLogin(matriculaAtual);		
					}
					$state.go('menu.home');
				});
		}
	});

	/**
	 * Home Controller
	 */
	angular.module('myApp').controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['Acesso'];

	function HomeCtrl(Acesso) {
		var vm = this;
		vm.aluno = Acesso.dados.nome;
	}

	/**
	 * Menu Controller
	 */
	angular.module('myApp').controller('MenuCtrl', MenuCtrl);

	MenuCtrl.$inject = ['Acesso'];

	function MenuCtrl(Acesso) {
		var vm = this;

		/** Versão do App */
		vm.versao = '1.0.0';

		vm.aluno = Acesso.dados.nome;
		vm.matricula = Acesso.dados.pessoa;
		vm.curso = Acesso.dados.curso;
		vm.semestre = Acesso.dados.serie;
	}

	/**
	 * Versao Controller
	 */
	angular.module('myApp').controller('VersaoCtrl', MenuCtrl);

	function VersaoCtrl() {
		var vm = this;

		/** Versão do App */
		vm.versao = '1.0.0';

	}

})();
