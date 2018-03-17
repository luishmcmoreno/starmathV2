import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameOverPage } from './game-over';

@NgModule({
  declarations: [
    GameOverPage,
  ],
  imports: [
    IonicPageModule.forChild(GameOverPage),
  ],
})
export class GameOverPageModule {}
