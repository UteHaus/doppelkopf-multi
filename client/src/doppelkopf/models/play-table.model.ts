export class PlayTable {
  id?: number;
  name: string;
  withNiner = false;
  status: PlayStatus;
  currentPlayerPosition: number;
  roundCardsGiversPosition: number;
  playerId?: number;
  diamondsAceAsMaster: boolean;
  weddingWithFirstColorCast: boolean;
  tableIcon?: string;
  additionalWeddingPlayerId?: number;
  gameVariant: GamesVariants;
}

export enum PlayStatus {
  None = 'None',
  Run = 'Run',
  Stop = 'Stop',
  Pause = 'Pause',
  End = 'End',
  SelectGameVarian = 'SelectGameVarian',
  WaitForNextRund = 'WaitForNextRund',
  WinnersTime = 'WinnersTime',
  RadyToStart = 'RadyToStart',
}

export enum GamesVariants {
  None = 'None',
  Normal = 'Normal',
  Wedding = 'Wedding',
  Solo = 'Solo',
  QueenSolo = 'QueenSolo',
  JackSolo = 'JackSolo',
  AceSolo = 'AceSolo',
  SuitSolo = 'SuitSolo',
  KingSolo = 'KingSolo',

  ColoRSoloClubs = 'ColoRSoloClubs',
  ColoRSoloDiamonds = 'ColoRSoloDiamonds',
  ColoRSoloHearts = 'ColoRSoloHearts',
  ColoRSoloSpades = 'ColoRSoloSpades',
}
