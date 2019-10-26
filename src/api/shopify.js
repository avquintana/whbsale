const { select } = require('../database');

const setProductQuantity = (cpnid, stocks, reference) => {
    return new Promise((resolve, reject) => {
        select('shopify_ids', ['cpnid', 'sku'], [cpnid, reference]).then(product => {
            getProduct(product.product).then(async response => {
                updateInventories(stocks, response.variants).then(() => {
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

const getProduct = (product) => {
    return new Promise((resolve, reject) => {
        resolve({
            variants: []
        });
    });
}

const getInventoryLevel = (inventory) => {
    return new Promise((resolve, reject) => {
        resolve([{
            location_id: '',
            inventory_item_id: ''
        }]);
    });
}

const setInventoryLevel = (inventory) => {
    return new Promise((resolve, reject) => {
        resolve();
    });
}

const updateInventories = (stocks, variants) => {
    return Promise.all(variants.map(variant => {
        return new Promise((resolve, reject) => {
            if (variant.sku === reference) {
                getInventoryLevel({ inventory_item_ids: variant.inventory_item_id }).then(level => {
                    setInventoryLevel({
                        location_id: level[0].location_id,
                        inventory_item_id: level[0].inventory_item_id,
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

