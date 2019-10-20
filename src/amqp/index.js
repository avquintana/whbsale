var amqp = require('amqplib/callback_api');
const { publish, startPublisher } = require('./producer');
const { startWorker } = require('./worker');

var amqpConn = null;

const whenConnected = (cb) => {
    startPublisher(amqpConn);
    startWorker(amqpConn, cb);
}

const connect = (cb) => {
    amqp.connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}?heartbeat=60`, function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(connect, 1000);
        }
        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });
        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(connect, 1000);
        });

        console.log("[AMQP] connected");
        amqpConn = conn;

        whenConnected(cb);
    });
}

module.exports = {
    connect,
    publish
}