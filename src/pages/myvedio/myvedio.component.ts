import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/datatype'
import { EventEmitter } from '@angular/core';
import { Events } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';
import { WebrtcService } from '../../providers/webrtc-server';

@Component({ selector: 'myvedio', templateUrl: 'myvedio.component.html' })
export class MyvedioComponent {

  private msg = '点击对应名称发起视频通话';
  private caller: string;
  private needanswer = false;
  private speaking = false;
  private videcall: any;
  private stream_l: any;
  private stream_r: any;
  constructor(
    public socket: SocketService,
    public events: Events,
    public rtc: WebrtcService,
    public userData: UserData,
    public userService: UserService
  ) {
    this.events.subscribe('user:tabchange', () => {
      console.log("收到通知user:tabchange");
      if (this.speaking) {
        console.log("屏幕切换结束通话");        
        this.end();
      }

    });

    this.videcall = this.socket.videcall.subscribe((data: any) => {

      switch (data.type) {
        case 'rtcend':
        console.log("收到rtcend");
          this.end();
          break;
        case 'call':
          this.needanswer = true;
          this.caller = data.data;
          break;
        case 'local':
          let localVideo_sub = document.querySelector('#localVideo');
          (<any>localVideo_sub).src = window.URL.createObjectURL(data.data);
          break;
        case 'remote':
          // (<any>rvideo).src = 
          let rvideo = document.querySelector('#remoteVideo');
          // (<any>rvideo).srcObject = data.stream;
          console.log('收到远端流xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', data.data.stream);

          (<any>rvideo).src = window.URL.createObjectURL(data.data.stream);
          console.log('收到远端流xxxxxxxxxxxxxxxxxxxxxxxxx', window.URL.createObjectURL(data.data.stream));

          break;

        default:
          break;
      }





    });
  }

  async call(user: any) {
    this.caller = user.socketId;
    this.msg = '等待对方回应';
    console.log('呼出：', user);
    let res = await this.socket.call(user.socketId);

    if (res) {
      this.msg = '对方同意视频';
      console.log('对方同意');
      this.rtc.init({ audio: true, video: true }, user.socketId, true);
      this.speaking = true;

    } else {
      this.msg = '对方拒绝视频';
      console.log('对方拒绝');
    }




  }


  answer(res: boolean) {
    this.needanswer = false;

    let data = new Data('answer', res)
    data.toWho = this.caller;
    this.socket.answer(data);

    if (res) {
      console.log('同意对方');
      this.rtc.init({ audio: true, video: true }, this.caller, false);
      this.speaking = true;
    } else {
      console.log('拒绝对方');
    }
  }
  end() {
    console.log('结束通话');
    if (this.speaking) {
      this.rtc.close(this.caller);
    } else {
      console.log("通话已经结束");
    }
     this.speaking = false;
     

  }

  test() {



    console.log('获取本地流');
    var mediaOptions = { audio: true, video: true };
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
    }
    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.');
    }
    navigator.getUserMedia(mediaOptions, (stream: any) => {
      let video = document.querySelector('#testVideo');
      console.log(stream);
      (<any>video).src = window.URL.createObjectURL(stream);
    }, function (e) {
      console.log(e);
    });



  }


}


