const { closeOnErr } = require('./error')

var amqpConn = null;

// A worker that acks messages only if processed succesfully
const startWorker = (conn, cb) => {
    amqpConn = conn;
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });
        ch.prefetch(10);
        ch.assertQueue("jobs", { durable: true }, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume("jobs", processMsg, { noAck: false });
            console.log("Worker is started");
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
}

module.exports = {
    startWorker
}