const api = require('prestashop-sdk-16');

const setProductQuantityVersion16 = (stocks, company, reference) => {
    return new Promise((resolve, reject) => {
        var Presta = new api({
            connection: `https://${company.webservice}@${company.url}`
        })
        var opt = {};
        if (url === 'https://www.chilemontana.cl') {
            opt = {
                filter: {
                    ean13: reference
                }
            }
        } else {
            opt = {
                filter: {
                    reference: reference
                }
            }
        }
        Presta.get('products', opt).then(function (response) {
            var id = response.products[0].product['id'];
            if (id) {
                opt = {
                    id: id
                }
                Presta.get('products', opt).then(function (response) {
                    // TODO: implement update request
                    console.log(response);
                }).catch(function (errors) {
                    console.log(errors);
                });
            }
        }).catch(function (errors) {
            console.log(errors);
        });
    });
}

const setProductQuantityVersion17 = (stocks, company, reference) => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

const setProductQuantity = (version, stocks, company, reference) => {
    return new Promise((resolve, reject) => {
        if (version === '1.6') {
            setProductQuantityVersion16(stocks, company, reference).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            })
        } else {
            setProductQuantityVersion17(stocks, company, reference).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            })
        }
    })
}

module.exports = {
    setProductQuantity
}