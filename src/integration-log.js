const { insert } = require('./database');

const logIntegrationAction = (cpnId, type, ecommerce, details, success) => {
    return new Promise((resolve, reject) => {
        if (!success) {
            details = `NO PROCESADO ${details}`;
        }
        insert('integracion_log', ['cpnid', 'tipo', 'ecommerce', 'detail'],
            [cpnId, type, ecommerce, details]).then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            });
    });
}

module.exports = {
    logIntegrationAction
};