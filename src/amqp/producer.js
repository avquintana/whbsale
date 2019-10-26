const { closeOnErr } = require('./error')

var pubChannel = null;
var offlinePubQueue = [];
var amqpConn = null;

const startPublisher = (conn) => {
    return new Promise((resolve, reject) => {
        amqpConn = conn;
        amqpConn.createConfirmChannel(function (err, ch) {
            if (closeOnErr(err, amqpConn)){
                reject(err);
                return;
            } 
            ch.on("error", function (err) {
                console.error("[AMQP] channel error", err.message);
            });
            ch.on("close", function () {
                console.log("[AMQP] channel closed");
            });

            pubChannel = ch;
            while (true) {
                var m = offlinePubQueue.shift();
                if (!m) break;
                publish(m[0], m[1], m[2]);
            }
            resolve();
        });
    });
}

// method to publish a message, will queue messages internally if the connection is down and resend later
const publish = (exchange, routingKey, content) => {
    try {
        pubChannel.publish(exchange, routingKey, content, { persistent: true },
            function (err, ok) {
                if (err) {
                    console.error("[AMQP] publish", err);
                    offlinePubQueue.push([exchange, routingKey, content]);
                    pubChannel.connection.close();
                }
            });
    } catch (e) {
        console.error("[AMQP] publish", e.message);
        offlinePubQueue.push([exchange, routingKey, content]);
    }
}

module.exports = {
    startPublisher,
    publish
}