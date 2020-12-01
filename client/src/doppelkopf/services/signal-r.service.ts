import { Injectable, Type } from '@angular/core';
import { AccountService } from '@app/services';
import {
  HubConnection,
  HubConnectionBuilder,
  IStreamResult,
} from '@aspnet/signalr';
import { environment } from '@environments/environment';

interface OnWaitType {
  methodName: string;
  newMethod: (...args: any[]) => void;
}

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private connection: HubConnection;
  private connectionOn: boolean;
  private onWaitList: OnWaitType[] = [];
  private onInvokeList: string[] = [];
  public get connectionRun(): boolean {
    return this.connection.state == 1;
  }
  constructor(accountService: AccountService) {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hub/playtable`, {
        accessTokenFactory: () => accountService.userValue.token,
      })
      .build();
    this.connection.keepAliveIntervalInMilliseconds = 1000 * 30;
    this.connection.serverTimeoutInMilliseconds = 1000 * 60;
    this.connect();
  }

  public on<T>(methodName: string, newMethod: (...args: any[]) => void): void {
    if (this.connectionOn) {
      this.connection.on(methodName, newMethod);
    } else {
      this.onWaitList.push({ methodName: methodName, newMethod: newMethod });
    }
  }

  public off(methodName: string, method: (...args: any[]) => void): void {
    this.connection.off(methodName, method);
  }

  public invoke<T = any>(methodName: string, ...args: any[]): Promise<T> {
    if (this.connectionOn) {
      return this.connection.invoke(methodName, args);
    } else {
      this.onInvokeList.push(methodName);
    }
  }

  public stream<T = any>(methodName: string, ...args: any[]): IStreamResult<T> {
    return this.connection.stream(methodName, args);
  }

  public close(): void {
    this.connection.stop().then(() => {
      this.connectionOn = false;
    });
  }

  private async connect() {
    await this.connection
      .start()
      .then(() => {
        console.log('Connection started');
        this.connectionOn = true;
        this.onWaitList.forEach((item) => {
          this.connection.on(item.methodName, item.newMethod);
        });
        this.onWaitList = [];
        this.onInvokeList.forEach((item) => {
          this.connection.invoke(item);
        });
        this.onInvokeList = [];
      })
      .catch((err) => console.error('Error while starting connection: ' + err));
  }
}
