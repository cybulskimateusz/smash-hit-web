import https from 'https';
import selfsigned from 'selfsigned';
import { WebSocket, WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 3002;

interface ExtendedWebSocket extends WebSocket {
    room?: string;
}

interface SignalingMessage {
    type?: string;
    room?: string;
    offer?: unknown;
    answer?: unknown;
    candidate?: unknown;
}

const pems = selfsigned.generate(undefined, { days: 365 });
const server = https.createServer({
  key: pems.private,
  cert: pems.cert,
}, (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>WebSocket Server</h1><p>Certificate accepted! You can close this tab.</p>');
});

const webSocketServer = new WebSocketServer({ server });

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server (WSS) running on port ${PORT}`);
});

webSocketServer.on('connection', (socket: ExtendedWebSocket) => {
    
  socket.on('message', (rawData: string) => {
    try {
      const data: SignalingMessage = JSON.parse(rawData);

      if (data.type === 'join' && data.room) {
        socket.room = data.room;
        console.log(`User joined room: ${socket.room}`);
        return;
      }

      if (socket.room) broadcastToRoom(socket, data);
    } catch (error) {
      console.error('Websocket message error: ', error);
    }
  });

  socket.on('close', () => {
    console.log('User left');
  });
});

function broadcastToRoom(sender: ExtendedWebSocket, data: SignalingMessage) {
  webSocketServer.clients.forEach((client: ExtendedWebSocket) => {
    if (
      client !== sender && 
      client.room === sender.room && 
      client.readyState === WebSocket.OPEN
    ) client.send(JSON.stringify(data));
  });
}