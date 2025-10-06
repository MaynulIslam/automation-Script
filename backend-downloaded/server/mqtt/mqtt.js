let mqtt = require("mqtt");
const constant = require('../util/constant')

const deviceTypeToFind = 'VAQS';
const vaqsTopics = constant.mqttTopics.find(item => item.deviceType === deviceTypeToFind)?.topics || [];

const topics = vaqsTopics;

// Create an MQTT client
const client = mqtt.connect(`ws://192.168.10.65:8080`);

// Handle MQTT client connection
client.on('connect', () => {
  console.log('MQTT client connected');

  // Subscribe to the specified topics
  client.subscribe(topics, (err) => {
    if (err) {
      console.error('Error subscribing to MQTT topics:', err);
    } else {
      console.log('Subscribed to MQTT topics:', topics);
    }
  });
});

// Handle MQTT message arrival
client.on('message', (topic, message) => {
  // console.log(`Received message on topic "${topic}": ${message.toString()}`);
});

// Handle MQTT client errors
client.on('error', (error) => {
  console.error('MQTT client error:', error);
});
