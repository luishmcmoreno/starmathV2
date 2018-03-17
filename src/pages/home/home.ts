import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public leavingPage: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams
  ) {}

  public async goSelectLevel(): Promise<void> {
    this.leavingPage = true;
    window.setTimeout(() => {
      this.navCtrl.setRoot('SelectLevelPage')
        .then(() => this.leavingPage = false);      
    }, 800);
  }

  ionViewDidLoad() {}

}
