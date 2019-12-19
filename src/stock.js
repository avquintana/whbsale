const { logIntegrationAction } = require('./integration-log')
const prestashop = require('./api/prestashop');
const bsale = require('./api/bsale');
const cscart = require('./api/cscart');
const woocommerce = require('./api/woocommerce');
const shopify = require('./api/shopify');
const { select } = require('./database');

const processStocks = (webhook, company) => {
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
        updateStock(webhook, company, webhook.resourceId, 0).then(() => {
            resolve();
        }).catch(error => {
            reject();
        });
    });
}

const updateStock = (webhook, company, variantId, resta, isDocument = false) => {
    return new Promise(async (resolve, reject) => {
        bsale.setToken(company.token);
        let variant = await bsale.get(`stocks.json?variantid=${variantId}`);
        let ref = await bsale.get(`variants/${variantId}.json`);
        let reference = ref.code;
        if (webhook.cpnId === 25913) {
            reference = ref.barCode;
        }
        let stocks = 0;

        if (company.oficina) {
            let offices = await select('oficinas', 'id_integracion', company.id);
            for (let stock of variant.items) {
                if (offices.findIndex(office => office.oficina === stock.office.id) != -1) {
                    stocks += stock.quantityAvailable;
                }
            }
        } else {
            for (let stock of variant.items) {
                if (resta === 0) {
                    stocks += stock.quantityAvailable;
                } else {
                    stocks = stock.quantityAvailable;
                }
            }
        }
        //Aqui
        // let variantId = variant.items[0].id;
        // if (variantId) {
        let details = `URL : ${company.url} > Nuevo Stock: ${stocks} > Variante: ${variantId} > Referencia: ${reference}`;
        if (isDocument) {
            details = `URL : ${company.url} > Nuevo Stock por Documentos: ${stocks} > Variante: ${variantId} > Referencia: ${reference}`;
        }
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
            shopify.setProductQuantity(webhook.cpnId, company, stocks, reference).then(() => {
                logIntegrationAction(webhook.cpnId, `Shopify Stocks`, 'Shopify', details, true).then(() => {
                    resolve();
                });
            }).catch(() => {
                logIntegrationAction(webhook.cpnId, `Shopify Stocks`, 'Shopify', details, false).then(() => {
                    reject();
                });
            });
        }
    });
}

module.exports = {
    processStocks,
    updateStock
}