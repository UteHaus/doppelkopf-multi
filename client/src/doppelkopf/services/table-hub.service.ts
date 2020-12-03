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
  private onInvokeList: string[] = [];
  private hubConnection: HubConnection;

  constructor(private accountService: AccountService) {
    this.start();
  }

  public InvokeForTables() {
    this.invokeMethode(TableHubMethods.tables);
  }

  public streamForTables(): IStreamResult<any> {
    return this.hubConnection.stream('tables');
  }

  public InvokeForTableGame() {
    this.invokeMethode('playertablestate');
  }

  private invokeMethode(methodeName: string) {
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
    this.hubConnection.on('tables', (data: any) => {
      this.tables$.next(data);
      console.log(data);
    });
    //this.hubConnection.invoke('tables');

    this.hubConnection.on('playertablestate', (data: any) => {
      console.log('data', data);
      this.tableGame$.next(data);
    });
  }
}
