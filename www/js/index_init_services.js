/*global data_support, intel */

/* --------------
 initialization
  the xdkFilter argument can be set to a function that
   receives the data of the service method and can return alternate data
   thus you can reformat dates or names, remove or add entries, etc.
   -------------- */

/*global angular*/
angular.module('myApp', ['ionic'])
    .config(['$controllerProvider', '$ionicConfigProvider', function ($controllerProvider, $ionicConfigProvider) {
        $controllerProvider.allowGlobals();
        $ionicConfigProvider.views.maxCache(0);
    }])

    .filter('capitalize', function () {
        return function (input, all) {
            var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
            return (!!input) ? input.replace(reg, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
        }
    })

    .service('XmlParse', XmlParse)
    .factory('WebService', WebService)
    .factory('Acesso', Acesso)
    .factory('PesqBiblio', PesqBiblio);

function XmlParse() {

    var options = {
        arrayAccessFormPaths: ['']
    };
    var x2js = new X2JS();

    this.toJSON = function (xmlString) {
        return x2js.xml_str2json(xmlString).Envelope.Body
    }

}

WebService.$inject = ['$http', 'XmlParse', '$ionicPopup', '$state'];
/**
 * Acesso aos dados do WebService
 */
function WebService($http, XmlParse, $ionicPopup, $state) {
    return {
        Request: Request
    };

    /**
     * Requisição ao WebService
     * @ service: BibliotecaWS, RecebedoriaWS ou NotaWS
     * @ method: método a ser executado. Ex: getNotasPorMatricula
     * @ params: array com os parâmetros em ordem
     */
    function Request(service, method, params) {

        var params = params || [];
        var paramList = '';

        params.forEach(function (arg, index) {
            var arg = '<arg' + index + '>' + arg + '</arg' + index + '>';
            paramList += arg;
        });

        var url = 'http://fdf.eddydata.com/' + service + '/' + service;

        var soapMessage =
            '<?xml version="1.0" encoding="UTF-8"?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">' +
            '    <S:Header/>' +
            '    <S:Body>' +
            '        <ns2:' + method + ' xmlns:ns2="http://ws.education.eddydata.com.br/">' +
            paramList +
            '        </ns2:' + method + ' >' +
            '    </S:Body>' +
            '</S:Envelope>';

        var headers = {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'http://fdf.eddydata.com/' + service + '/' + method
        };

        return $http
            .post(url, soapMessage, { "headers": headers })
            .then(function (response) {
                var jsonObj = XmlParse.toJSON(response.data)[method + 'Response'].return;
                return jsonObj;
            })
            .catch(function (error) {
                console.log(error);

                if (!error.data) {

                    var alertPopup = $ionicPopup.alert({
                        title: 'Erro!',
                        template: 'Não foi possível recuperar os dados. Verfique a sua conexão com a Internet.',
                    });

                } else {

                    var errorMessage = XmlParse.toJSON(error.data).Fault.faultstring;
                    console.debug('=== Requisição ao WS EddyData =================================================');
                    console.debug('Requisição retornou erro: ', errorMessage);
                    console.debug('Status: ' + error.status + ' - ' + error.statusText);

                    var alertPopup = $ionicPopup.alert({
                        title: 'Ocorreu um erro! Tente novamente.'
                    });
                }

                alertPopup.then(function (res) {
                    if (!$state.is('login')) {
                        $state.go('menu.home');
                    } else {
                        $state.go('login');
                    }

                });

            });

    }

};

Acesso.$inject = ['$ionicPopup', '$state', '$window', 'WebService'];

function Acesso($ionicPopup, $state, $window, WebService) {

    var Acesso = {
        dados: {
            curso: '',
            id: '',
            nome: '',
            pessoa: '',
            serie: '',
            situacao: '',
            turno: '',
            logado: false
        },
        getAcesso: function () {
            if (this.dados = JSON.parse(localStorage.getItem('Acesso'))) {
                return this.dados;
            }
            return false;
        },
        guardaLogin: function (acessoObj) {
            try {
                this.dados = acessoObj;
                localStorage.setItem('Acesso', angular.toJson(acessoObj));
                return true;
            } catch (e) {
                console.log(e);
                return false
            }
        },
        sair: function () {
            this.dados = {
                logado: false
            };
            return this.guardaLogin(this.dados);
        }
        /*,
        notas: function () {
            var self = this;
            WebService.Request('NotaWS', 'avaliacaoRespondida', [self.dados.pessoa])
                .then(function (response) {
                    var respondida = JSON.parse(response);

                    if (self.dados.curso.toLocaleUpperCase().indexOf('MEDICINA') !== -1) {
                        $ionicPopup.alert({
                            title: 'Aviso!.',
                            template: 'Os dados necessários para a exibição das notas do curso de Medicina ainda não estão disponíveis. '
                            + 'Por favor, aguarde atualizações.'
                        });
                    } else if (!respondida) {
                        $ionicPopup.confirm({
                            title: 'Aviso!.',
                            template: 'É preciso responder a avaliação instucional. Deseja responder agora?',
                            okText: 'Sim',
                            cancelText: 'Não'
                        })
                            .then(function (res) {
                                if (res) {
                                    // vai responder
                                    $window.open('http://avalinst.unifacef.com.br', '_system', 'location=yes');
                                    return false;
                                }
                            });
                    } else {
                        $state.go('menu.notas')
                    }

                });
        }*/
    };

    return Acesso;
}


PesqBiblio.$inject = ['WebService'];

function PesqBiblio($ionicPopup, $state, $window, WebService) {

    var Pesquisa = {
        idTipoMaterial: 0,
        titulo: '',
        autor: '',
        assunto: '',
        sensorPesq: 0,
        sensorGeral: 0,
        sensorAssuntos: 0,
        sensorExemplares: 0,
        idMaterial: '',
        ttMaterial: '',
        ddRetiradaObra: '',
        listaTipoMaterial: [],
        listaMateriais: [],
        listaAutores: [],
        listaAssuntos: [],
        listaExemplares: []
    };

    return Pesquisa;
}
