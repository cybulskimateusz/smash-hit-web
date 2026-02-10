import https from 'https';
import selfsigned from 'selfsigned';
import { WebSocket, WebSocketServer } from 'ws';

import MESSAGE_TYPES from './MESSAGE_TYPES.js';

const PORT = Number(process.env.PORT) || 3002;

interface Player {
  id: string;
  ws: WebSocket;
  color: number;
  score: number;
}

interface Message {
  type: string;
  payload: unknown;
}

const players = new Map<string, Player>();

// Generate self-signed certificate
const pems = selfsigned.generate(null, { days: 365 });
const server = https.createServer({
  key: pems.private,
  cert: pems.cert,
}, (_req, res) => {
  // Simple handler for browser certificate acceptance
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>WebSocket Server</h1><p>Certificate accepted! You can close this tab.</p>');
});

const wss = new WebSocketServer({ server });

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket server (WSS) running on port ${PORT}`);
});

function broadcast(message: Message, excludeId?: string) {
  const data = JSON.stringify(message);
  players.forEach((player) => {
    if (player.id !== excludeId && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(data);
    }
  });
}

function send(ws: WebSocket, message: Message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function generateColor(): number {
  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da];
  return colors[Math.floor(Math.random() * colors.length)];
}

wss.on(MESSAGE_TYPES.CONNECTION, (ws) => {
  const playerId = crypto.randomUUID();
  const color = generateColor();

  const player: Player = {
    id: playerId,
    ws,
    color,
    score: 0,
  };

  players.set(playerId, player);

  console.log(`Player connected: ${playerId}`);

  // Send player their own info
  send(ws, {
    type: MESSAGE_TYPES.PLAYER_WELCOME,
    payload: {
      playerId,
      color,
      isLocal: true,
    },
  });

  // Send existing players to new player
  players.forEach((existingPlayer) => {
    if (existingPlayer.id !== playerId) {
      send(ws, {
        type: MESSAGE_TYPES.PLAYER_JOINED,
        payload: {
          playerId: existingPlayer.id,
          color: existingPlayer.color,
          score: existingPlayer.score,
          isLocal: false,
        },
      });
    }
  });

  // Notify others about new player
  broadcast({
    type: MESSAGE_TYPES.PLAYER_JOINED,
    payload: {
      playerId,
      color,
      score: 0,
      isLocal: false,
    },
  }, playerId);

  ws.on(MESSAGE_TYPES.MESSAGE, (data) => {
    try {
      const message: Message = JSON.parse(data.toString());

      switch (message.type) {
      case MESSAGE_TYPES.BALL_THROWN:
        broadcast({
          type: MESSAGE_TYPES.BALL_THROWN,
          payload: {
            ...message.payload as object,
            playerId,
          },
        }, playerId);
        break;

      case MESSAGE_TYPES.AIM_UPDATE:
        broadcast({
          type: MESSAGE_TYPES.AIM_UPDATE,
          payload: {
            ...message.payload as object,
            playerId,
          },
        }, playerId);
        break;

      case MESSAGE_TYPES.TOTEM_DESTROYED: {
        const payload = message.payload as { points: number };
        player.score += payload.points;
        broadcast({
          type: MESSAGE_TYPES.SCORE_UPDATED,
          payload: {
            playerId,
            score: player.score,
          },
        });
        break;
      }

      case MESSAGE_TYPES.STATE_SYNC:
        broadcast({
          type: MESSAGE_TYPES.STATE_SYNC,
          payload: {
            ...message.payload as object,
            playerId,
          },
        }, playerId);
        break;

      default:
        broadcast(message, playerId);
      }
    } catch (err) {
      console.error('Failed to parse message:', err);
    }
  });

  ws.on(MESSAGE_TYPES.CLOSE, () => {
    console.log(`Player disconnected: ${playerId}`);
    players.delete(playerId);

    broadcast({
      type: MESSAGE_TYPES.PLAYER_LEFT,
      payload: { playerId },
    });
  });

  ws.on(MESSAGE_TYPES.ERROR, (err) => {
    console.error(`WebSocket error for ${playerId}:`, err);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  wss.close(() => {
    process.exit(0);
  });
});
