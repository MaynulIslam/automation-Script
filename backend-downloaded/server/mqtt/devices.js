// const common = require('../util/common');
// const dgram = require('dgram');
// const discoveredDevices = {};

// const discoverySocket = dgram.createSocket('udp4');

// discoverySocket.on('message', (message, remoteInfo) => {
//   const deviceInfo = common.parseDeviceInfo(message.toString());
//   if(deviceInfo){
//     const deviceIdentifier = remoteInfo.address;
//     const deviceDetails = {...deviceInfo, id: remoteInfo.address, ipAddress: remoteInfo.address, status: false }
//     discoveredDevices[deviceIdentifier] = deviceDetails;
//   }
// });

// discoverySocket.on('listening', () => {
//   const address = discoverySocket.address();
//   console.log(`UDP server listening on ${address.address}:${address.port}`);
// });

// discoverySocket.bind(30303);

// const discoverDevices = () => {
//   const udpClient = dgram.createSocket('udp4');
//   const broadcastAddress = '255.255.255.255';

//   udpClient.on('message', (msg, rinfo) => {
//     const deviceIdentifier = rinfo.address;
//     const deviceInfo = common.parseDeviceInfo(msg.toString());
//     const deviceDetails = {...deviceInfo, id: rinfo.address, ipAddress: rinfo.address, status: false }
//     discoveredDevices[deviceIdentifier] = deviceDetails;
//   });

//   udpClient.on('error', (err) => {
//     console.error('Error in UDP client:', err.message);
//     udpClient.close();
//   });

//   udpClient.bind(() => {
//     udpClient.setBroadcast(true);
//     const discoveryMessage = 'Discovery: Who is out there?';
//     udpClient.send(discoveryMessage, 0, discoveryMessage.length, 30303, broadcastAddress);
//   });
// };

// discoverDevices();


// module.exports = {
//   discoveredDevices
// }