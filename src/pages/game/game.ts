import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CoreGame } from './../../core/game';

declare var Phaser: any;

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  public starMath: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) { }


  private buildPhaserRenderer() {
    const width = window.innerWidth;
    const heigth = window.innerHeight;
    this.starMath = new Phaser.Game(width, heigth, Phaser.CANVAS, 'phaser-example');
    this.starMath.state.add('Game', CoreGame);
    this.starMath.state.start('Game');
  }

  ionViewDidLoad() {
    this.buildPhaserRenderer();
  }

}
