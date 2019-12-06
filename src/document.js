const { logIntegrationAction } = require('./integration-log')
const { updateStock } = require('./stock')
const prestashop = require('./api/prestashop');
const bsale = require('./api/bsale');
const cscart = require('./api/cscart');
const woocommerce = require('./api/woocommerce');
const shopify = require('./api/shopify');

const processDocuments = (webhook, company) => {
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
        let documents = bsale.get(`documents/${webhook.resourceId}/details.json?limit=100`);
        let doc = bsale.get(`documents/${webhook.resourceId}.json`);
        const doc_url = doc.document_type.href.substr(24, 100);
        const document_type = bsale.get(doc_url);

        let resta = 0;
        if (document_type.id === 7 && webhook.cpnId === 8016 && company.oficina === 2) {
            resta = 1;
        }
        updateDocuments(webhook, company, documents.items, resta, true).then(()=> {
            resolve();
        }).catch(error => {
            reject(error);
        });
    });
}

const updateDocuments = (webhook, company, documents) => {
    return Promise.all(documents.map(document => {
        return new Promise((resolve, reject) => {
            updateStock(webhook, company, document.variant.id, 0).then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }));
}

module.exports = {
    processDocuments,
    updateDocuments
}