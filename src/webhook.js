const { select } = require('./database');
const { processStock } = require('./stock');

const processWebhook = (webhook, ack) => {
    select('integracion', 'cpnid', webhook.cpnId).then(companies => {
        updateCompanies(webhook, companies);
        ack(true);
    }).catch(error => {
        console.error(error);
        ack(false);
    });
}

const updateCompanies = (webhook, companies) => {
    return Promise.all(companies.map(company => {
        return updateCompany(webhook, company);
    }));
}

/*if ($varBsales['topic'] == "stock" )
        {
            $bsale = new BSaleClass();
        //    $bsale->setToken($token);
            $id_integracion = $tabla['id'];
            $url = $tabla['url'];
            $bsale->procesa_stocks($varBsales, $conexion, $url, $id_integracion);
        }

        /*** PROCESO DOCUMENTOS PARA REBAJAR STOCKS **

        if ($varBsales['topic'] == "document" )
        {
            $bsale = new BSaleClass();
     //       $bsale->setToken($token);
            $url = $tabla['url'];
            $bsale->procesa_documentos($varBsales, $conexion, $url);
        }

        if ($varBsales['topic'] == "price" )
        {
            $bsale = new BSaleClass();
    //        $bsale->setToken($token);
            $url = $tabla['url'];
            $precio_minimo = $tabla['precio_minimo'];
            $bsale->procesa_precios($varBsales, $conexion, $url, $precio_minimo);
        }

        if ($varBsales['topic'] == "variant" || $varBsales['topic'] == "product" )
        {
            $bsale = new BSaleClass();
         //   $bsale->setToken($token);
            $url = $tabla['url'];
            $bsale->procesa_variantes($varBsales, $conexion, $url);
        } */

const updateCompany = (webhook, company) => {
    return new Promise((resolve, reject) => {
        if (webhook.topic === 'stock') {
            processStock(webhook, company).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        } else if (webhook.topic === 'document') {

        } else {

        }
    });
}

module.exports = {
    processWebhook
};