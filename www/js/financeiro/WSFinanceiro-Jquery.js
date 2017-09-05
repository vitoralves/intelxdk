$(document).ready(function() {    
    
    getMensalidades(89086);
    
    
    function getMensalidades(idMensalidades){
        var soapMessage = 

       '<?xml version="1.0" encoding="UTF-8"?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">' +
       '    <S:Header/>' +
       '    <S:Body>' +
       '        <ns2:getMensalidades xmlns:ns2="http://ws.education.eddydata.com.br/">' +
       '            <arg0>' + idMensalidades + '</arg0>' +
       '        </ns2:getMensalidades>' +
       '    </S:Body>' +
       '</S:Envelope>';

       $.ajax({
           url: "http://unifacef.eddydata.com/RecebedoriaWS/RecebedoriaWS",
           type: "POST",
           dataType: "xml",
           contentType: "text/xml; charset=\"utf-8\"",
           headers: {
              SOAPAction: "http://ws.education.eddydata.com.br/RecebedoriaWS/getMensalidades"
           },
           data: soapMessage,
           complete: endSaveProduct
        });


       function endSaveProduct(xmlHttpRequest, status)
        {
            
            var valor = "";
            
             $(xmlHttpRequest.responseXML)
                .find('return')
                .each(function(){
                    valor += '<div style="margin: 20px 20px; padding: 10px; border: 1px solid black">';
                    valor += '<p> Parcela: ' + $(this).find('parcela').text() + '</li>';
                    valor += '<p> Vencimento: ' + $(this).find('documento').text() + '</li>';
                    valor += '<p> Valor: ' + $(this).find('valor').text() + '</li>';
                    valor += '<p> Valor Líquido: ' + $(this).find('valor1').text() + '</li>';
                    valor += '<p> Data Pagamento: ' + $(this).find('situacao').text() + '</li>';
                    valor += '<p> Valor Pago: ' + $(this).find('valorPago').text() + '</li>';
                    valor += '<p> Boleto: ' + $(this).find('nome').text() + '</li>';
                    valor += '</div>';
                 });
            
            $('#teste').append(valor);

        }
       
    };
    
});


