import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayTableListComponent } from './play-table-list/play-table-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EditTableComponent } from './play-table-list/edit-table/edit-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GameTableComponent } from './game-table/game-table.component';
import { CardMapComponent } from './game-table/card-map/card-map.component';
import { PlayStatusRunPipe } from './game-table/play-status-run.pipe';
import { CardComponent } from './game-table/card-map/card/card.component';
import { CareImagePathPipe } from './game-table/card-map/care-image-path.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlayerIconPipe } from './game-table/players-table/player-icon.pipe';
import { ShowCardsPipe } from './game-table/show-cards.pipe';
import { PlayStatusWaitNextRoundPipe } from './game-table/play-status-wait-next-round.pipe';
import { PlayStatusWinnerTimePipe } from './game-table/play-status-winner-time.pipe';
import { PlayStatusSelectVariantPipe } from './game-table/play-status-select-variant.pipe';
import { ValideGameVariantPipe } from './game-table/valide-game-variant.pipe';
import { PlayersTableComponent } from './game-table/players-table/players-table.component';
import { CardIndexPositionPipe } from './game-table/players-table/card-index-position.pipe';
import { AuthGuard } from '@app/helpers';
import { SpectatorViewComponent } from './game-table/spectator-view/spectator-view.component';
import { PlayerViewComponent } from './game-table/player-view/player-view.component';
import { AuthGuardEditTables } from '@app/helpers/auth-edit-tables.guard';
import { AuthAdminGuard } from '@app/helpers/auth-admin.guard';
import { SelectVariantComponent } from './game-table/player-view/select-variant/select-variant.component';
import { HoverStepBoardComponent } from './game-table/player-view/hover-step-board/hover-step-board.component';
import { ResultTableComponent } from './game-table/player-view/hover-step-board/result-table/result-table.component';
import { NextTurnButtonComponent } from './game-table/player-view/hover-step-board/next-turn-button/next-turn-button.component';
import { InplaceInputComponent } from './game-table/players-table/inplace-input/inplace-input.component';
const routes: Routes = [
  {
    path: 'table',
    component: EditTableComponent,
    canActivate: [AuthGuard, AuthGuardEditTables, AuthAdminGuard],
  },

  {
    path: '',
    component: PlayTableListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'table/:id',
    component: GameTableComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'player',
        component: PlayerViewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'spectator',
        component: SpectatorViewComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    PlayTableListComponent,
    EditTableComponent,
    GameTableComponent,
    CardMapComponent,
    PlayStatusRunPipe,
    CardComponent,
    CareImagePathPipe,
    SelectVariantComponent,
    PlayerIconPipe,
    ShowCardsPipe,
    PlayStatusWaitNextRoundPipe,
    PlayStatusWinnerTimePipe,
    PlayStatusSelectVariantPipe,
    ValideGameVariantPipe,
    PlayersTableComponent,
    CardIndexPositionPipe,
    SpectatorViewComponent,
    PlayerViewComponent,
    HoverStepBoardComponent,
    ResultTableComponent,
    NextTurnButtonComponent,
    InplaceInputComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  exports: [RouterModule],
})
export class DoppelkopfModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
