const get = (url, data = []) => {
    return new Promise((resolve, reject) => {

    });
}

const update = (url, data = []) => {
    return new Promise((resolve, reject) => {

    });
}

const setProductQuantity = (stocks, reference) => {
    return new Promise((resolve, reject) => {
        get('products', {
            'sku': reference
        }).then(products => {
            if (products.length > 0) {
                const product = products[0];
                let url = `products/${product.id}`;
                if (product.type !== 'simple') {
                    url = `products/${product.parent_id}/variations/${product.id}`;
                }
                update(url, {
                    managing_stock: true,
                    in_stock: true,
                    stock_quantity: stocks
                }).then(() => {
                    resolve();
                }).catch(error => {
                    reject();
                });
            } else {
                resolve();
            }
        }).catch(error => {
            reject(error);
        })
    });
}

module.exports = {
    setProductQuantity
};