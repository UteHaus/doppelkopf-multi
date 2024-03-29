import { Injectable } from '@angular/core';
import { User } from '@app/models';
import { AccountService } from '@app/services';
import { environment } from '@environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { TableMethods as TableHubMethods } from './table-hub-method.enum';

@Injectable({
  providedIn: 'root',
})
export class TableHubService {
  connectionEstablished$ = new BehaviorSubject<boolean>(false);
  private invokeList: TableHubMethods[] = [];
  private onList: Array<{
    methodeName: TableHubMethods;
    method: (...args: any[]) => void;
  }> = [];
  private hubConnection: HubConnection;

  constructor(private accountService: AccountService) {
    this.start();
  }

  public invokeMethode(methodeName: TableHubMethods) {
    if (this.isHubConnected()) {
      this.hubConnection.invoke(methodeName);
    } else {
      this.invokeList.push(methodeName);
    }
  }

  public offMethode(methodeName: TableHubMethods) {
    if (this.isHubConnected()) {
      this.hubConnection.off(methodeName);
    }
  }

  public onMethode(
    methodeName: TableHubMethods,
    method: (...args: any[]) => void
  ) {
    if (this.isHubConnected()) {
      this.hubConnection.on(methodeName, method);
    } else {
      this.onList.push({ methodeName: methodeName, method: method });
    }
  }

  private isHubConnected(): boolean {
    return (
      this.hubConnection &&
      this.hubConnection.state === HubConnectionState.Connected
    );
  }

  private start(): void {
    this.accountService.user.subscribe((user) => {
      if (user && user.token && !this.hubConnection) {
        this.createConnection(user);
        this.registerOnServerEvents();
        this.startConnection();
      }
    });
  }

  private createConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub/playtable`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000, null])
      .configureLogging(LogLevel.Information)
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
        this.onList.forEach((item) => {
          this.hubConnection.on(item.methodeName, item.method);
        });
        this.onList = [];

        this.connectionEstablished$.next(true);
        this.invokeList.forEach((item) => {
          this.hubConnection.invoke(item);
        });
        this.invokeList = [];
      },
      (error) => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    /*      this.hubConnection.on(TableHubMethods.Tables, (data: any) => {
      console.log('Update table list');

      this.tables$.next(data);
    });

    this.hubConnection.on(TableHubMethods.PlayerTableState, (data: any) => {
      console.log('Update table state');

      this.tableGame$.next(data);
    });

    this.hubConnection.on(TableHubMethods.SpectatorTable, (data: any) => {
      this.tableGame$.next(data);
    }); */
  }
}
