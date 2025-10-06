const common = require('../util/common');

const ipAddress = '192.168.10.65'; // Replace this with your dynamically obtained IP address

const main = async ()=>{
  const responseDiag = await common.getDataFromDiagXml(ipAddress);
  console.log('response getDataFromDiagXml',JSON.stringify(responseDiag));
  const responseStatus = await common.getDataFromStatusXml(ipAddress);
  console.log('response getDataFromStatusXml',JSON.stringify(responseStatus));
}

main();