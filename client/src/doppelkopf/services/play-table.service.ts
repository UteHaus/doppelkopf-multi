import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { GamesVariants, PlayTable } from '../models/play-table.model';
import { environment } from '@environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PlayTableCount } from '../models/play-table-count.model';
import { PlayTableGame } from '../models/play-table-game.model copy';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class PlayTableService {
  private defaultApiPath = `${environment.apiUrl}/playtable`;

  constructor(private http: HttpClient) {}

  public getTablesWithAutoReload(
    intervalMilSeconds: number = 5000
  ): Observable<PlayTableCount[]> {
    return timer(0, intervalMilSeconds).pipe(switchMap(() => this.getTables()));
  }

  public getTables(): Observable<PlayTableCount[]> {
    return this.http.get<PlayTableCount[]>(this.defaultApiPath);
  }

  public getById(id: string): Observable<PlayTable> {
    return this.http.get<PlayTable>(`${this.defaultApiPath}/${id}`);
  }

  public getTableGameState(userId: number): Observable<PlayTableGame> {
    return this.http
      .get<PlayTableGame>(`${this.defaultApiPath}/player/${userId}/state`)
      .pipe(
        map((playTable) => {
          playTable.thisPlayer = playTable.players.find(
            (p) => p.playerId == userId
          );
          return playTable;
        })
      );
  }

  public createTable(playTable: PlayTable): Observable<PlayTable> {
    return this.http.post<PlayTable>(this.defaultApiPath, playTable);
  }

  public deleteTable(tableId: number | string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.defaultApiPath}/${tableId}`);
  }

  public updateTable(playTable: PlayTable): Observable<PlayTable> {
    return of(playTable);
  }

  public runWithOnTable(tableId: number, userId: number): Observable<boolean> {
    return this.http
      .put(`${this.defaultApiPath}/${tableId}/on-table?userId=${userId}`, {
        userId: userId,
      })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  public logoutOfTable(userId: number | string): Observable<undefined> {
    return this.http.put<undefined>(
      `${this.defaultApiPath}/out-table?userId=${userId}`,
      {}
    );
  }

  public getUserPlayTable(userId: number): Observable<PlayTable> {
    return this.http.get<PlayTable>(`${this.defaultApiPath}/player/${userId}`);
  }

  public startGame(tableId: number): Observable<boolean> {
    return this.http.put<boolean>(
      `${this.defaultApiPath}/${tableId}/start`,
      {}
    );
  }

  public shuffleCards(playerId: number): Observable<undefined> {
    return this.http.put<undefined>(
      `${this.defaultApiPath}/player/${playerId}/shuffle-cards`,
      {}
    );
  }

  public playedCard(card: Card, userId: number): Observable<undefined> {
    return this.http.put<undefined>(
      `${this.defaultApiPath}/player/${userId}/played-cards`,
      card
    );
  }

  public nextTurn(playerId: number): Observable<undefined> {
    return this.http.put<undefined>(
      `${this.defaultApiPath}/player/${playerId}/next`,
      {}
    );
  }

  public isTableUpdated(
    tableId: number,
    lastUpdate: number
  ): Observable<boolean> {
    return this.http
      .get<string>(`${this.defaultApiPath}/${tableId}/last-update`)
      .pipe(
        map((date) => {
          const backendUpdate = new Date(date).getTime();
          return lastUpdate < backendUpdate;
        })
      );
  }

  public setGameVariant(
    playerId: number,
    variant: GamesVariants
  ): Observable<undefined> {
    return this.http.put<undefined>(
      `${this.defaultApiPath}/player/${playerId}/variant?variant=${variant}`,
      {}
    );
  }
}
