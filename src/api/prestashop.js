const api = require('prestashop-sdk-16');

const getCombinationByReference = (Presta, reference) => {
    return new Promise((resolve, reject) => {
        opt = {
            filter: {
                reference
            },
            display: '[id,id_product]'
        }
        Presta.get('combinations', opt).then(function (response) {
            console.log(response);
            resolve(response.prestashop.combinations);
        }).catch(function (errors) {
            reject(errors);
        });
    });
}

const setProductQuantityVersion16 = (stocks, company, reference) => {
    return new Promise((resolve, reject) => {
        // var Presta = new api({
        //     connection: `https://${company.webservice}@${url.hostname}`
        // })
        var Presta = new api({
            storeUrl: company.url[company.url.length - 1] === '/' ?
                company.url.substr(0, company.url.length - 1) : company.url,
            apiKey: company.webservice
        });
        var opt = {};
        if (company.url === 'https://www.chilemontana.cl') {
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
        Presta.get('products', opt).then(async function (response) {
            var id;
            try {
                id = response.prestashop.products.product.$.id;
            } catch (error) {
                console.log(error);
            }
            var attributeId = 0;
            // if (!id) {
                var response = await getCombinationByReference(Presta, reference);
            // }
            if (id) {
                opt = {
                    id: id
                }
                Presta.edit('products', { price: 0 }, opt).then(function (response) {
                    console.log(response);
                }).catch(function (errors) {
                    console.log(errors);
                });
                // Presta.get('products', opt).then(function (response) {
                //     // TODO: implement update request
                //     console.log(response);

                // }).catch(function (errors) {
                //     console.log(errors);
                // });
            }
        }).catch(function (errors) {
            console.log(errors);
        });
        resolve();
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