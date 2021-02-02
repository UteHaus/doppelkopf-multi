import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { JitsiService } from 'src/jitsi/services/jitsi.service';
import { PlayTable } from '../models/play-table.model';
import { UserUseCase } from '../models/user-use-case.model';
import { PlayTableService } from '../services/play-table.service';
import { TableMethods } from '../services/table-hub-method.enum';
import { TableHubService } from '../services/table-hub.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.less'],
})
export class GameTableComponent implements OnInit, OnDestroy {
  table$: Observable<PlayTable>;
  tableId$: Observable<number>;

  constructor(
    private tableService: PlayTableService,
    private route: ActivatedRoute,
    private tableHub: TableHubService,
    private routing: Router,
    private jitsiService: JitsiService
  ) {}

  ngOnDestroy(): void {
    this.tableHub.offMethode(TableMethods.UserUseCase);
  }

  ngOnInit(): void {
    this.table$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((tableId: number) => this.tableService.getTable(tableId))
    );
    this.tableHub.onMethode(TableMethods.UserUseCase, (value) => {
      const useCase = value as UserUseCase;
      if (useCase.useCase == 'Player') {
        this.routing.navigate(['player'], { relativeTo: this.route });
      } else {
        this.routing.navigate(['spectator'], { relativeTo: this.route });
      }
    });
  }

  reloadTable() {}

  openJitsi(tableName: string): void {
    this.jitsiService.openJitsiInNewBrowserTab(`${tableName}`);
  }
}
