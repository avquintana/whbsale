const setProductQuantityVersion16 = (stocks, company, reference) => {
    return new Promise((resolve, reject) => {

    });
}

const setProductQuantityVersion17 = (stocks, company, reference) => {
    return new Promise((resolve, reject) => {

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
    setProductQuantityPrestashop,
}