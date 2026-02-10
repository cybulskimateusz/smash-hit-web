export interface NetworkMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface PlayerWelcomePayload {
  playerId: string;
  color: number;
  isLocal: boolean;
}

export interface PlayerJoinedPayload {
  playerId: string;
  color: number;
  score: number;
  isLocal: boolean;
}

export interface PlayerLeftPayload {
  playerId: string;
}

export interface BallThrownPayload {
  playerId: string;
  direction: [number, number, number];
}

export interface TotemDestroyedPayload {
  totemId: string;
  playerId: string;
  points: number;
}

export interface ScoreUpdatedPayload {
  playerId: string;
  score: number;
}

export interface StateSyncPayload {
  playerId: string;
  position: [number, number, number];
}

export type MessageType =
  | 'player:welcome'
  | 'player:joined'
  | 'player:left'
  | 'ball:thrown'
  | 'totem:destroyed'
  | 'score:updated'
  | 'state:sync';
