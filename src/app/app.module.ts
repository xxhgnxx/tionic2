import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

// new
import { WebrtcComponent } from '../pages/webrtc/webrtc.component';
import { VoiceComponent } from '../pages/voice/voice.component';
import { ChatComponent } from '../pages/chat/chat.component';
import { RtcComponent } from '../pages/rtccom/rtccom.component';
import { MyvedioComponent } from '../pages/myvedio/myvedio.component';

import { SocketService } from '../providers/socket-server';
import { UserService } from '../providers/user-server';
import { WebrtcService } from '../providers/webrtc-server';


@NgModule({
  declarations: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    WebrtcComponent,
    MyvedioComponent,
    RtcComponent,
    VoiceComponent,
    ChatComponent,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage
  ],
  imports: [
    IonicModule.forRoot(ConferenceApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    AboutPage,
    AccountPage,
    LoginPage,
    WebrtcComponent,
    MyvedioComponent,
    VoiceComponent,
    ChatComponent,
    RtcComponent,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage
  ],
  providers: [
    ConferenceData,
    UserData,
    SocketService,
    WebrtcService,
    UserService,
    Storage
  ]
})
export class AppModule { }
