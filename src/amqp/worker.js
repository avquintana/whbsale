const { closeOnErr } = require('./error')

var amqpConn = null;

// A worker that acks messages only if processed succesfully
const startWorker = (conn, cb) => {
    return new Promise((resolve, reject) => {
        amqpConn = conn;
        amqpConn.createChannel(function (err, ch) {
            if (closeOnErr(err)){
                reject(err);
                return;
            }
            ch.on("error", function (err) {
                console.error("[AMQP] channel error", err.message);
            });
            ch.on("close", function () {
                console.log("[AMQP] channel closed");
            });
            ch.prefetch(10);
            ch.assertQueue(process.env.RABBIT_QUEUE, { durable: true }, function (err, _ok) {
                if (closeOnErr(err)){
                    reject(err);
                    return;
                }
                ch.consume(process.env.RABBIT_QUEUE, processMsg, { noAck: false });
                console.log("Worker is started");
                resolve();
            });

            function processMsg(msg) {
                var incomingDate = (new Date()).toISOString();
                console.log("Msg [deliveryTag=" + msg.fields.deliveryTag + "] arrived at " + incomingDate);
                cb(msg, function (ok) {
                    console.log("Sending Ack for msg at time " + incomingDate);
                    try {
                        if (ok)
                            ch.ack(msg);
                        else
                            ch.reject(msg, true);
                    } catch (e) {
                        closeOnErr(e, amqpConn);
                    }
                });
            }
        });
    });
}

module.exports = {
    startWorker
}