import { Component, ViewChild } from '@angular/core';

import { NavParams, Tabs } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';

import { WebrtcComponent } from '../webrtc/webrtc.component';
import { VoiceComponent } from '../voice/voice.component';
import { ChatComponent } from '../chat/chat.component';
import { MyvedioComponent } from '../myvedio/myvedio.component';
import { SocketService } from '../../providers/socket-server';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild(Tabs) tabs: Tabs;
  // set the root pages for each tab
  tab0Root: any = SchedulePage;
  tab1Root: any = SchedulePage;
  tab2Root: any = ChatComponent;
  tab3Root: any = VoiceComponent;
  tab4Root: any = MyvedioComponent;
  mySelectedIndex: number;

  constructor(
    navParams: NavParams,
    public socketService: SocketService,
    private events: Events
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  clearnewnumber() {
    console.log("clearnewnumber");
    this.socketService.newmsgnumber = 0;
    this.socketService.newmsg = false;
  }

  getnemsgnumber() {
    if (this.socketService.newmsgnumber.toString() != "0") {
      return this.socketService.newmsgnumber.toString();
    } else {
      return null;
    }
  }
  tabchange() {
    if ((this.tabs.getSelected() && this.tabs.getSelected().index) === 2) {
      this.socketService.newmsg = true;
    };
    this.events.publish('user:tabchange');
  }
}
