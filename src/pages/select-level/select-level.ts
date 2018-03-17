import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select-level',
  templateUrl: 'select-level.html',
})
export class SelectLevelPage {

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams) {
  }

  private changeAstronautPosition(): void {
    // Use it to transition the astronaut
  }

  ionViewDidLoad() {}

}
