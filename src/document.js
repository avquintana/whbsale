const { logIntegrationAction } = require('./integration-log')
const prestashop = require('./api/prestashop');
const bsale = require('./api/bsale');
const cscart = require('./api/cscart');
const woocommerce = require('./api/woocommerce');
const shopify = require('./api/shopify');

const updateDocuments = (webhook, company) => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

module.exports = {
    updateDocuments
}