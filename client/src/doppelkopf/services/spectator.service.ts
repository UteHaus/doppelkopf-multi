import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpectatorService {
  private defaultApiPath = `${environment.apiUrl}/spectator`;
  constructor(private http: HttpClient) {}

  public setSpectatorOnTable(
    userId: number,
    tableId: number
  ): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.defaultApiPath}?tableId=${tableId}&userId=${userId}`,
      {}
    );
  }

  public cancelSpectatorOnTable(userId: number): Observable<boolean> {
    return this.http.put<boolean>(
      `${this.defaultApiPath}?userId=${userId}`,
      {}
    );
  }

  public setAsAdditionPlayer(
    userId: number,
    seeOn: boolean
  ): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.defaultApiPath}/asAdditionPlayer?userId=${userId}&seeOn=${seeOn}`,
      {}
    );
  }

  public showCardsOf(userId: number, playerId: number): Observable<boolean> {
    return this.http.put<boolean>(
      `${this.defaultApiPath}/${userId}/cards-of/${playerId}`,
      {}
    );
  }
}
