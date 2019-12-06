const { select } = require('../database');
const Shopify = require('shopify-api-node');

var shopify;

const setProductQuantity = (cpnId, company, stocks, reference) => {
    return new Promise((resolve, reject) => {
        select('shopify_ids', ['cpnid', 'sku'], [cpnId, reference]).then(product => {
            const url = new URL(company.url);
            shopify = new Shopify({
                shopName: url.hostname,
                apiKey: company.usuario,
                password: company.cs_key
            });
            shopify.product.get(product.product).then((response) => {
                updateInventories(stocks, response.variants, reference).then(() => {
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    })
}

const updateInventories = (stocks, variants, reference) => {
    return Promise.all(variants.map(variant => {
        return new Promise((resolve, reject) => {
            if (variant.sku === reference) {
                shopify.inventoryLevel.list({ inventory_item_ids: variant.inventory_item_id }).then(levels => {
                    shopify.inventoryLevel.set({
                        location_id: levels[0].location_id,
                        inventory_item_id: levels[0].inventory_item_id,
                        available: stocks
                    }).then(() => {
                        resolve();
                    }).catch(error => {
                        reject(error);
                    });
                }).catch(error => {
                    reject(error);
                });
            } else {
                resolve();
            }
        });
    }));
}

module.exports = {
    setProductQuantity
}

