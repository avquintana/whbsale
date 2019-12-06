var dotenv = require('dotenv');
const https = require('https')

dotenv.config();

var TOKEN;

const setToken = (token) => {
    this.TOKEN = token;
}

const post = (target, data = []) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.BSALE_API_HOST,
            port: process.env.BSALE_API_PORT,
            path: target[0] === '/' ? target : `/${target}`,
            method: 'POST',
            headers: {
                'access_token': this.TOKEN,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            }
        };

        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (responseData) => {
                console.log(`BODY: ${responseData}`);
                resolve(responseData);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        // Write data to request body
        req.write(data);
        req.end();
    });
}

const get = (target) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.BSALE_API_HOST,
            port: process.env.BSALE_API_PORT,
            path: target[0] === '/' ? target : `/${target}`,
            method: 'GET',
            headers: {
                'access_token': this.TOKEN,
                'Accept': 'application/json',
            }
        };

        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (responseData) => {
                console.log(`BODY: ${responseData}`);
                resolve(responseData);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        req.end();
        // return {
        //     code: 1243,
        //     items: [
        //         {
        //             id: 234,
        //             quantityAvailable: 3,
        //             office: {
        //                 id: 790
        //             }
        //         }
        //     ]
        // };
    });
}

const put = (target, data = []) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: process.env.BSALE_API_HOST,
            port: process.env.BSALE_API_PORT,
            path: target[0] === '/' ? target : `/${target}`,
            method: 'PUT',
            headers: {
                'access_token': this.TOKEN,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            }
        };

        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (responseData) => {
                console.log(`BODY: ${responseData}`);
                resolve(responseData);
            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e);
        });

        // Write data to request body
        req.write(data);
        req.end();
    });
}

module.exports = {
    setToken,
    post,
    get,
    put,
}