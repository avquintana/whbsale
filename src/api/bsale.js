var dotenv = require('dotenv');

dotenv.config();

const post = (target, data = []) => {

}

const getOne = (target, data = []) => {
    return {
        code: 1243,
        items: [
            {
                id: 234,
                quantityAvailable: 3,
                office: {
                    id: 790
                }
            }
        ]
    };
}

const getAll = (target, data = []) => {

}

const put = (target, data = []) => {
    
}

const getStock = (target, data = []) => {
    
}

module.exports = {
    post,
    getOne,
    getAll,
    put,
    getStock,
}