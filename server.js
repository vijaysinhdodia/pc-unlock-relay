const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

let pcSocket = null;
let mobileSocket = null;

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'REGISTER_PC') {
        pcSocket = ws;
        console.log('PC Connected!');
        ws.send(JSON.stringify({ status: 'REGISTERED_AS_PC' }));
      } else if (data.type === 'REGISTER_MOBILE') {
        mobileSocket = ws;
        console.log('Mobile Connected!');
        ws.send(JSON.stringify({ status: 'REGISTERED_AS_MOBILE' }));
      } else if (data.type === 'UNLOCK_REQUEST' && pcSocket) {
        pcSocket.send(JSON.stringify({ action: 'UNLOCK' }));
      }
    } catch (e) {
      console.error(e);
    }
  });

  ws.on('close', () => {
    if (ws === pcSocket) pcSocket = null;
    if (ws === mobileSocket) mobileSocket = null;
  });
});

console.log(`Relay server running on port ${PORT}`);