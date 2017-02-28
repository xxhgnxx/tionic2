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
import { DomSanitizer } from '@angular/platform-browser';

@Component({ selector: 'webrtc', templateUrl: 'webrtc.component.html' })
export class WebrtcComponent {
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

  private localStream: any;

  private isanswer = true;

  @ViewChild('video') private localVideo: any;
  @ViewChild('video2') private remoteVideo: any;

  constructor(
    public socketService: SocketService, public domSanitizer: DomSanitizer, public userData: UserData, public userService: UserService
  ) {
    this.rtcEmitter = this.socketService.rtcEmitter.subscribe((data: Data) => {
      // console.log('收到数据包', data);
      if (data.type === 'desc') {
        this.setdesc(data.data);
        return;
      }
      if (data.type === 'candidate') {
        this.setcandidate(data.data);
        return;
      }
    });
  }

  public ngOnInit() {
    // 123
  };
  public testmsg() {
    // 123
    this.socketService.emit(new Data('test', '测试消息'));
  };
  private async Start() {
    let ok = await this.socketService.start()
    if (ok) {
      this.step = 2;
      console.log('初始化');
    } else {
      console.log('连接服务器失败');
    }
  }

  public setdesc(desc: any) {
    console.log('收到desc', desc);
    this.pc.setRemoteDescription(new (<any>window).RTCSessionDescription(desc)).then(
      () => {
        console.log('设置远端desc成功');
        if (this.isanswer) {
          this.pc.createAnswer().then(
            (desc: any) => {
              console.log('createAnswer成功');
              this.pc.setLocalDescription(desc).then(
                () => {
                  console.log('设置本地desc成功');
                  this.socketService.emit(new Data('desc', desc));
                  this.step = 6;
                },
                (err: any) => console.log('setLocalDesc错误', err));
            },
            (err: any) => console.log('createAnswer错误', err));
        } else { this.step = 6; };
      },
      (err: any) => console.log('setRemoteDesc错误', err));
  }


  public setcandidate(candidate: any) {
    this.pc.addIceCandidate(candidate).then(
      function () {
        // console.log('收到candidate', candidate);
      },
      function (err: any) {
        console.log(err);
        console.log(candidate);
      });
  }

  private setStream() {
    this.step = 1;
    console.log('获取本地流');
    var mediaOptions = { audio: true, video: true };
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
    }
    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.');
    }
    navigator.getUserMedia(mediaOptions, (stream: any) => {
      let video = document.querySelector('#localVideo');
      console.log(stream);
      this.localStream = stream;
      (<any>video).src = window.URL.createObjectURL(stream);
    }, function (e) {
      console.log(e);
    });

  }


  private peerconnection() {

    if (this.isanswer) {
      this.step = 5;
    } else {
      this.step = 4;
    }

    this.pc = new (<any>window).RTCPeerConnection(this.iceServer);
    console.log(this.pc);
    this.pc.onicecandidate = (evt: any) => {
      console.log('获取candidate');
      if (evt.candidate) {
        this.socketService.emit(new Data('candidate', evt.candidate));
        // console.log('send icecandidate');
      };
    };
    console.log('设置待发送stream', this.localStream);
    // this.localStream.getTracks().forEach(track => this.pc.addTrack(track, this.localStream));
    this.pc.addStream(this.localStream);
    this.pc.onaddstream = (e: any) => {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx绑定远端流');
      let rvideo = document.querySelector('#remoteVideo');
      // (<any>rvideo).src = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(e.stream));
      (<any>rvideo).src = window.URL.createObjectURL(e.stream);

      // this.remoteVideo.nativeElement.src = URL.createObjectURL(e.stream);
    };
    console.log('当前步骤', this.step);
  }

  private Call() {
    this.isanswer = false;
    this.step = 3;
  };
  private answer() {
    this.isanswer = true;
    this.step = 3;

  };

  private end() {
    this.pc.close();
    this.step = 2;
  }

  private setoffer() {
    this.pc.createOffer().then(
      (desc: any) => {
        console.log('createOffer成功');
        this.pc.setLocalDescription(desc).then(
          () => {
            console.log('设置本地desc成功', desc);
            this.socketService.emit(new Data('desc', desc));
          },
          (err: any) => {
            console.log('setLocalDesc错误', err);
          }
        );
      },
      (err: any) => {
        console.log('createOffer错误', err);
      }
    );

  };

  ngOnDestroy() {
    console.log('垃圾清理');

    this.rtcEmitter.unsubscribe();
  }


  private setanswer() {
    // todo
  };
}
