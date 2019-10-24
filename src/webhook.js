const { select } = require('./database');

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

const updateCompany = (webhook, company) => {
    return new Promise((resolve, reject) => {
        // TODO: implement
    });
}

module.exports = {
    processWebhook
};