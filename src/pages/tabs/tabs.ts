import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';

import { WebrtcComponent } from '../webrtc/webrtc.component';
import { VoiceComponent } from '../voice/voice.component';
import { ChatComponent } from '../chat/chat.component';
import { MyvedioComponent } from '../myvedio/myvedio.component';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = ChatComponent;
  tab3Root: any = VoiceComponent;
  tab4Root: any = MyvedioComponent;
  mySelectedIndex: number;

  constructor(
    navParams: NavParams,
    private events: Events
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }


  tabchange() {
    console.log("tabchange");
    this.events.publish('user:tabchange');
  }
}
