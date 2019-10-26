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
            pcode: reference
        }).then(response => {
            update(`products/${response.products[0].product_id}`, {
                amount: stocks
            }).then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

module.exports = {
    setProductQuantity
};