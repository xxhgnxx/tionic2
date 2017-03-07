/// <reference path="../../typings/index.d.ts"/>


import { Component, ViewChild } from '@angular/core';

import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';



import { WebrtcComponent } from '../pages/webrtc/webrtc.component';
import { VoiceComponent } from '../pages/voice/voice.component';


import { ConferenceData } from '../providers/conference-data';
// import { UserData } from '../providers/user-data';
import { UserService } from '../providers/user-server';
import { SocketService } from '../providers/socket-server';


export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}
declare var cordova: any;

@Component({
  templateUrl: 'app.template.html'
})
export class ConferenceApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: '用户列表', component: TabsPage, icon: 'contacts' },
    { title: '文字聊天', component: TabsPage, index: 1, icon: 'chatboxes' },
    { title: '语音房间', component: TabsPage, index: 2, icon: 'microphone' },
    { title: '视频房间', component: TabsPage, index: 3, icon: 'videocam' }
  ];
  loggedInPages: PageInterface[] = [
    { title: '个人资料', component: AccountPage, icon: 'person' },
    { title: '技术支持', component: SupportPage, icon: 'help' },
    { title: '登出', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: '登陆', component: LoginPage, icon: 'log-in' },
    { title: '技术支持', component: SupportPage, icon: 'help' },
    { title: '注册', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any;

  constructor(
    public events: Events,
    // public userData: UserData,
    public menu: MenuController,
    public platform: Platform,
    public confData: ConferenceData,
    public userService: UserService,
    public socketService: SocketService,
    public storage: Storage
  ) {

    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = TutorialPage;
        }
        this.platformReady()
      })

    // load the conference data
    confData.load();

    // decide which menu items should be hidden by current login status stored in local storage
    // this.userData.hasLoggedIn().then((hasLoggedIn) => {
    //   this.enableMenu(hasLoggedIn === true);
    // });
    if (this.userService.isLogin) {
      this.enableMenu(true);

    } else {
      this.enableMenu(false);
    }

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario

    if (page.icon === 'log-out') {
      this.socketService.logout();
      return;
    }

    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });

    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        // this.userData.logout();
      }, 1000);
    }
  }
  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }
  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {

      this.nav.setRoot(LoginPage);
    });
    this.events.subscribe('socket:call', () => {
      this.nav.setRoot(TabsPage, { tabIndex: 3 });
    });
  }
  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(() => {
      Splashscreen.hide();
      try {
        if ((<any>window).device.platform === 'iOS') {
          cordova.plugins.iosrtc.registerGlobals();
        }
      } catch (error) {
        console.log(error);

      }

    });
  }
}
