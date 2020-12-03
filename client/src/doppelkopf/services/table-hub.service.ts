import { Injectable } from '@angular/core';
import { AccountService } from '@app/services';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IStreamResult,
  LogLevel,
} from '@aspnet/signalr';
import { environment } from '@environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { PlayTableCount } from '../models/play-table-count.model';
import { TablePlayerState } from '../models/table-player-state.model';
import { TableMethods as TableHubMethods } from './table-hub-method.enum';

@Injectable({
  providedIn: 'root',
})
export class TableHubService {
  tables$ = new Subject<PlayTableCount[]>();
  tableGame$ = new Subject<TablePlayerState>();
  connectionEstablished$ = new BehaviorSubject<boolean>(false);
  private onInvokeList: TableHubMethods[] = [];
  private hubConnection: HubConnection;

  constructor(private accountService: AccountService) {
    this.start();
  }

  public InvokeMethode(methode: TableHubMethods) {
    this.invokeMethode(methode);
  }

  private invokeMethode(methodeName: TableHubMethods) {
    if (
      this.hubConnection &&
      this.hubConnection.state === HubConnectionState.Connected
    ) {
      this.hubConnection.invoke(methodeName);
    } else {
      this.onInvokeList.push(methodeName);
    }
  }
  private start(): void {
    if (this.accountService.userValue.token && !this.hubConnection) {
      this.createConnection();
      this.registerOnServerEvents();
      this.startConnection();
    }
  }

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub/playtable`, {
        accessTokenFactory: () => this.accountService.userValue.token,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000, null])
      .configureLogging(LogLevel.Critical)
      .build();
    this.hubConnection.keepAliveIntervalInMilliseconds = 1000 * 30;
    this.hubConnection.serverTimeoutInMilliseconds = 1000 * 60;
  }

  private async startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    await this.hubConnection.start().then(
      () => {
        console.log('Hub connection started!');
        this.connectionEstablished$.next(true);
        this.onInvokeList.forEach((item) => {
          this.hubConnection.invoke(item);
        });
        this.onInvokeList = [];
      },
      (error) => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on(TableHubMethods.Tables, (data: any) => {
      this.tables$.next(data);
    });

    this.hubConnection.on(TableHubMethods.PlayerTableState, (data: any) => {
      this.tableGame$.next(data);
    });

    this.hubConnection.on(TableHubMethods.SpectatorTable, (data: any) => {
      this.tableGame$.next(data);
    });
  }
}
