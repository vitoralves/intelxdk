(function(){
	"use strict";
	angular.module("myApp").config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise("/login");

		$stateProvider

		.state("login", {
			url:"/login",
			templateUrl:"views/login.html"
		})


		.state("menu", {
			url:"/menu",
			templateUrl:"views/menu.html",
			abstract: true,
			controller: "initCtrl"
		})


		.state("menu.home", {
			url:"/home",
			views:{
				'menuContent':{
					templateUrl:"views/home.html"
				}
			}
		})

		.state("menu.notas", {
			url:"/notas",
			views:{
				'menuContent':{
					templateUrl:"views/notas.html"
				}
			},
		})

        .state("menu.biblioteca", {
			url:"/biblioteca",
			views:{
				'menuContent':{
					templateUrl:"views/biblioteca.html"
				}
			}
		})

        .state("menu.financeiro", {
			url:"/financeiro",
			views:{
				'menuContent':{
					templateUrl:"views/financeiro.html"
				}
			}
		})


        .state("menu.listaMateriais", {
			url:"/listaMateriais",
			views:{
				'menuContent':{
					templateUrl:"views/listaMateriais.html"
				}
			}
		})

        .state("menu.detalheMaterial", {
			url:"/detalheMaterial",
			views:{
				'menuContent':{
					templateUrl:"views/detalheMaterial.html"
				}
			}
		})

				.state("menu.detalheMaterial.detalheMaterialGeral", {
			url:"/detalheMaterialGeral",
			views:{
				'tab-geral':{
					templateUrl:"views/detalheMaterialGeral.html"
				}
			}
		})

			.state("menu.detalheMaterial.detalheMaterialAssuntos", {
		url:"/detalheMaterialAssuntos",
		views:{
			'tab-assuntos':{
				templateUrl:"views/detalheMaterialAssuntos.html"
			}
		}
	})

			.state("menu.detalheMaterial.detalheMaterialExemplares", {
		url:"/detalheMaterialExemplares",
		views:{
			'tab-exemplares':{
				templateUrl:"views/detalheMaterialExemplares.html"
			}
		}
	});


	});
})();
