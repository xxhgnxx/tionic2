import { Component } from '@angular/core';
import { MenuController, NavController, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { UserService } from '../../providers/user-server';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public userService: UserService,
    public storage: Storage
  ) { }

  startApp() {

    if (this.userService.isLogin) {
      this.navCtrl.push(TabsPage);
    } else {
      this.navCtrl.push(LoginPage).then(() => {
        this.storage.set('hasSeenTutorial', 'true');
      })
    }



  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    // this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    // this.menu.enable(true);
  }

}
