const setProductQuantityVersion16 = (stocks, company, reference) => {
    return new Promise((resolve, reject) => {
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