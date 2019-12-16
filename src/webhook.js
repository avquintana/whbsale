const { select } = require('./database');
const { processStocks } = require('./stock');
const { processDocuments } = require('./document');
const { updatePrices } = require('./price');
const { updateVariants } = require('./variant');

const processWebhook = (webhook, ack) => {
    select('integracion', 'cpnid', webhook.cpnId).then(companies => {
        updateCompanies(webhook, companies).then(() => {
            ack(true);
        }).catch(error => {
            console.error(error);
            ack(false);
        });
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

const updateCompany = (webhook, company) => {
    return new Promise((resolve, reject) => {
        if (webhook.topic === 'stock') {
            processStocks(webhook, company).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        }
        if (webhook.topic === 'document') {
            processDocuments(webhook, company).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        }

        if(webhook.topic === 'price') {
            updatePrices(webhook, company).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        }

        if(webhook.topic === 'variant' || webhook.topic === 'product') {
            updateVariants(webhook, company).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        }
    });
}

module.exports = {
    processWebhook
};