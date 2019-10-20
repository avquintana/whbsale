var dotenv = require('dotenv');
const { connect, publish } = require('./src/amqp')
// if the connection is closed or fails to be established at all, we will reconnect
function start() {
  dotenv.config();
  connect(work);
}

const work = (msg, cb) => {
  console.log("Got msg", msg.content.toString());
  cb(true);
}

setInterval(function() {
  publish("", "jobs", new Buffer("work work work"));
}, 1000);

start();