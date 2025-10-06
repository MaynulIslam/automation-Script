// const { client } = require("../util/common");
const mqtt = require('mqtt')

var client = mqtt.connect(`mqtt://${process.env.MQTT_URL}:1883`);
setInterval(() => {
  client.publish("CREATE_ORG", JSON.stringify({progress: 25, updateText: 'Creating database...', isUpdating: true }));
  console.log("published");
}, 5000);
client.on('error', (error) => {
  console.error('client error:', error);
});

// Subscribe to the "CREATE_ORG" topic
client.subscribe('CREATE_ORG', function (err) {
  if (!err) {
    console.log('Subscribed to CREATE_ORG topic');
  }
});

// Handle incoming messages
client.on('message', function (topic, message) {
  // Message is Buffer, so you may need to convert it to a string
  console.log('Received message on topic:', topic, ' Message:', message.toString());
});

// Handle errors
client.on('error', (error) => {
  console.error('Client error:', error);
});
