var dotenv = require('dotenv');
const { connect, publish } = require('./src/amqp');
const { processWebhook } = require('./src/webhook.js')
const bodyParser = require('body-parser');
var express = require('express');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

const processMsg = (msg, ack) => {
    console.log('Received msg', msg.content.toString());
    const webhook = JSON.parse(msg.content.toString());
    processWebhook(webhook, ack);
}

const start = () => {
    connect(processMsg).then(() => {
        app.listen(process.env.APP_PORT, function () {
            console.log(`App listening on port ${process.env.APP_PORT}!`);
        });
        app.post('/', function (req, res) {
            publish('', process.env.RABBIT_QUEUE, new Buffer(JSON.stringify(req.body)));
            res.send('Your request will be process soon!');
        });
    }).catch(error => {
        console.error(error);
    });
}
start();