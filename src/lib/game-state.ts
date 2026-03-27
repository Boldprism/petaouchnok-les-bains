export interface Parcelle {
  id: number;
  culture: string | null;
  planteeLe: Date | null;
  prete: boolean;
}

export interface GameState {
  userId: string;
  eclats: number;
  parcelles: Parcelle[];
  fragmentsDebloques: string[];
  moisActuel: number;
  derniereConnexion: Date;
}

export function createDefaultGameState(userId: string): GameState {
  return {
    userId,
    eclats: 100, // Starting bonus
    parcelles: [
      { id: 1, culture: null, planteeLe: null, prete: false },
      { id: 2, culture: null, planteeLe: null, prete: false },
      { id: 3, culture: null, planteeLe: null, prete: false },
    ],
    fragmentsDebloques: ['f1', 'f2', 'f3', 'f5'], // Month 1 unlocked fragments
    moisActuel: 1,
    derniereConnexion: new Date(),
  };
}

export function calculateIdleEclats(lastConnection: Date): number {
  const now = new Date();
  const hoursElapsed = (now.getTime() - lastConnection.getTime()) / (1000 * 60 * 60);
  // 1 Éclat per hour of idle time, max 24
  return Math.min(Math.floor(hoursElapsed), 24);
}
