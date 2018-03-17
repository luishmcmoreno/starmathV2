import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {}

  public goSelectLevel(): void {
    this.navCtrl.setRoot('SelectLevelPage');
  }

  ionViewDidLoad() {}

}
