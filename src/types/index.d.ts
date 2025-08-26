// Lista de jogos disponíveis
export type Game =
  | "SlotMachine"
  | "ThreeCardMonte"
  | "RocketGame"
  | "MinerGame"


export interface UserData {
  name: string;
  profilePicture: string;
  creditsAvaliable: number;
  stats?: UserStats
}

// Estatísticas do usuário
export interface UserStats {
  wins: number;
  losses: number;
  mostPlayedGame: Game | null;
  creditsEarned: number;
  creditsLost: number;
  gameStats?: Partial<Record<Game, { wins: number; losses: number }>>;
}
