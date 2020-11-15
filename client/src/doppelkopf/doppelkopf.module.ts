import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayTableListComponent } from './overview/play-table-list/play-table-list.component';
import { RouterModule, Routes } from '@angular/router';
import { EditTableComponent } from './overview/play-table-list/edit-table/edit-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GameTableComponent } from './game-table/game-table.component';
import { CardMapComponent } from './game-table/card-map/card-map.component';
import { PlayStatusRunPipe } from './game-table/play-status-run.pipe';
import { CardComponent } from './game-table/card-map/card/card.component';
import { CareImagePathPipe } from './game-table/card-map/care-image-path.pipe';
import { SelectVariantComponent } from './game-table/select-variant/select-variant.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlayerComponent } from './game-table/player/player.component';
import { PlayerIconPipe } from './game-table/player/player-icon.pipe';
import { ShowCardsPipe } from './game-table/show-cards.pipe';
import { PlayStatusWaitNextRoundPipe } from './game-table/play-status-wait-next-round.pipe';
import { PlayStatusWinnerTimePipe } from './game-table/play-status-winner-time.pipe';
import { PlayStatusSelectVariantPipe } from './game-table/play-status-select-variant.pipe';
import { ValideGameVariantPipe } from './game-table/valide-game-variant.pipe';
import { PlayersTableComponent } from './game-table/players-table/players-table.component';
import { CardIndexPositionPipe } from './game-table/players-table/card-index-position.pipe';
import { AuthGuard } from '@app/helpers';
const routes: Routes = [
  {
    path: 'table',
    component: EditTableComponent,
    canActivate: [AuthGuard],
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
    PlayerComponent,
    PlayerIconPipe,
    ShowCardsPipe,
    PlayStatusWaitNextRoundPipe,
    PlayStatusWinnerTimePipe,
    PlayStatusSelectVariantPipe,
    ValideGameVariantPipe,
    PlayersTableComponent,
    CardIndexPositionPipe,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule.forChild(),
  ],
  exports: [RouterModule],
})
export class DoppelkopfModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}