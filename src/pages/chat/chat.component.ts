import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/datatype'
import { EventEmitter } from '@angular/core';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';

@Component({ selector: 'chat', templateUrl: 'chat.component.html' })
export class ChatComponent {
  private iceServer = {
    "iceServers": [
      {
        // "url": "stun:stun.l.google.com:19302"
        "url": "stun:hk.airir.com"
        // "url": "stun:stunserver.org"
      },
      {
        "url": "turn:hk.airir.com",
        "username": "123",
        "credential": "123"
      }
    ]
  };
  private step = 0;
  private socketisonline: boolean;
  private pc: any;
  private rtcEmitter: EventEmitter<any>;
  private testmsg = '';
  private localStream: any;

  private isanswer = true;

  @ViewChild('video') private localVideo: any;
  @ViewChild('video2') private remoteVideo: any;

  constructor(
    public socketService: SocketService, public userData: UserData, public userService: UserService
  ) { }

  public ngOnInit() {
    // 123
  };


  ngOnDestroy() {

  }

  sendmsg() {
    console.log(this.testmsg);
    if (this.testmsg) {
      let data = new Data("testMsg", this.testmsg)
      data.fromWho = this.userService.yourself;
      this.socketService.emit(data);
    }
    this.testmsg = '';
  }

  private setanswer() {
    // todo
  };
}
