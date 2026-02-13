const MESSAGE_TYPES = {
  // WebSocket events
  CONNECTION: 'connection',
  MESSAGE: 'message',
  CLOSE: 'close',
  ERROR: 'error',

  // Player events
  PLAYER_WELCOME: 'player:welcome',
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',

  // Game events
  BALL_THROWN: 'ball:thrown',
  AIM_UPDATE: 'aim:update',
  TOTEM_DESTROYED: 'totem:destroyed',
  SCORE_UPDATED: 'score:updated',
  STATE_SYNC: 'state:sync',
} as const;

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

export default MESSAGE_TYPES;
