const { logIntegrationAction } = require('./integration-log')
const prestashop = require('./api/prestashop');
const bsale = require('./api/bsale');
const cscart = require('./api/cscart');
const woocommerce = require('./api/woocommerce');
const shopify = require('./api/shopify');

const updateStocks = (webhook, company) => {
    return new Promise((resolve, reject) => {
        if (company.stocks === 0) {
            reject('Cliente no procesa stocks');
        }
        if (company.status === 0) {
            reject('Status inactivo de cliente');
        }
        if (!company.token) {
            reject('Empty token');
        }
        let variant = bsale.getOne(`stocks.json?variantid=${webhook.resourceId}`);
        let ref = bsale.getOne(`variants/${webhook.resourceId}.json`);
        let reference = ref.code;
        if (webhook.cpnId === 25913) {
            reference = ref.barCode;
        }
        let stocks = 0;
        if (company.oficina) {
            let offices = select('oficinas', 'id_integracion', company.id);
            for (let stock of variant.items) {
                if (offices.findIndex(office => office.oficina === stock.office.id) != -1) {
                    stocks += stock.quantityAvailable;
                }
            }
        } else {
            for (let stock of variant.items) {
                stocks += stock.quantityAvailable;
            }
        }
        let variantId = variant.items[0].id;
        if (variantId) {
            let details = `URL : ${company.url} > Nuevo Stock: ${stocks} > Variante: ${variantId} > Referencia: ${reference}`;
            if (company.ecommerce === 'Prestashop') {
                prestashop.setProductQuantity(company.version, stocks, company, reference).then(() => {
                    logIntegrationAction(webhook.cpnId, `Prestashop ${company.version} Stocks`, 'Prestashop', details, true).then(() => {
                        resolve();
                    });
                }).catch(() => {
                    logIntegrationAction(webhook.cpnId, `Prestashop ${company.version} Stocks`, 'Prestashop', details, false).then(() => {
                        reject();
                    });
                });
            }
            if (company.ecommerce === 'Cscart') {
                // TODO: set api credentials
                // 'api_key' => $cs_key,
                // 'user_login' => $email,
                // 'api_url' => $url
                cscart.setProductQuantity(stocks, reference).then(() => {
                    logIntegrationAction(webhook.cpnId, `Cscart Stocks`, 'Cscart', details, true).then(() => {
                        resolve();
                    });
                }).catch(() => {
                    logIntegrationAction(webhook.cpnId, `Cscart Stocks`, 'Cscart', details, false).then(() => {
                        reject();
                    });
                });

            }

            if (company.ecommerce === 'Wordpress') {
                // TODO: set api credentials
                // $url = $url."/index.php/";
                // 		$woocommerce = new Client(
                // 		$url, 
                // 		$webservice, 
                // 		$cs_key,
                // 			[
                // 				'wp_api' => true,
                // 				'version' => 'wc/v2',
                // 			]
                // 		);
                woocommerce.setProductQuantity(stocks, reference).then(() => {
                    logIntegrationAction(webhook.cpnId, `Wordpress Stocks`, 'Wordpress', details, true).then(() => {
                        resolve();
                    });
                }).catch(() => {
                    logIntegrationAction(webhook.cpnId, `Wordpress Stocks`, 'Wordpress', details, false).then(() => {
                        reject();
                    });
                });
            }

            if (company.ecommerce === 'Shopify') {
                // TODO: set api credentials
                /*$llaves = array(
							'ShopUrl' => $url,
							'ApiKey' => $email,
							'Password' =>  $cs_key,
						);
                        $bsale->set_product_stocks_shopify($stocks, $url, $webservice, $variantId, $referencia, $llaves, $varBsales['cpnId'],$conexion);
                         */
                shopify.setProductQuantity(webhook.cpnId, stocks, reference).then(() => {
                    logIntegrationAction(webhook.cpnId, `Shopify Stocks`, 'Shopify', details, true).then(() => {
                        resolve();
                    });
                }).catch(() => {
                    logIntegrationAction(webhook.cpnId, `Shopify Stocks`, 'Shopify', details, false).then(() => {
                        reject();
                    });
                });
            }
        }
    });
}

module.exports = {
    updateStocks
}