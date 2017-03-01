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

@Component({ selector: 'rtccom', templateUrl: 'rtccom.component.html' })
export class RtcComponent {
  private iceServer = {
    "iceServers": [{ "url": "stun:hk.airir.com" },
    {
      "url": "turn:hk.airir.com",
      "username": "123",
      "credential": "123"
    }]
  };
  private step = 0;
  private socketisonline: boolean;
  private pc: any;
  private rtcEmitter: EventEmitter<any>;
  private myvalue = 0;
  private t1t = 0;
  private t2t = 0;
  private localStream: any;
  private soundMeter: any;
  private localaudio: any
  private AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
  private audioContext = new AudioContext();
  private isanswer = true;



  constructor(
    public socketService: SocketService, public userData: UserData, public userService: UserService
  ) {
    // this.soundMeter = new SoundMeter(this.audioContext);
    setInterval(() => {
      // this.myvalue = this.soundMeter.instant;
      this.t1t++;
      console.log(this.t1t);
    }, 1000);

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
    var mediaOptions = { audio: true, video: false };
    if (!navigator.getUserMedia) {
      navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
    }
    if (!navigator.getUserMedia) {
      return alert('getUserMedia not supported in this browser.');
    }
    navigator.getUserMedia(mediaOptions, (stream: any) => {

      console.log(stream);
      this.localStream = stream;
      let audio = document.querySelector('#localaudio');

      console.log("xxxxxxxxxxxxxx", audio);

      (<any>audio).src = window.URL.createObjectURL(stream);


      this.soundMeter.connectToSource(stream, (e: any) => console.log(e));
    }, (e) => console.log(e));




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
      // console.log('获取candidate');
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

  test() {
    setInterval(() => {
      // this.myvalue = this.soundMeter.instant;
      this.t2t++;
      console.log(this.t2t);
    }, 1000);
    // console.log('test', document.querySelector('#localaudio'));

    // this.setStream()
    // this.peerconnection()



  }
  private setanswer() {
    // todo
  };

  ngAfterViewInit() {

    console.log('ngAfterViewInit', document.querySelector('#localaudio'));


  }

}



class SoundMeter {
  public instant: any;
  public clip: any;
  public script: any;
  public mic: any;
  constructor(private context: AudioContext) {

    this.instant = 0.0;
    this.clip = 0.0;
    this.script = this.context.createScriptProcessor(2048, 1, 1);
    this.script.onaudioprocess = (event: any) => {
      var input = event.inputBuffer.getChannelData(0);
      var i;
      var sum = 0.0;
      var clipcount = 0;
      for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
        if (Math.abs(input[i]) > 0.99) {
          clipcount += 1;
        }
      }
      this.instant = Math.sqrt(sum / input.length);
      this.clip = clipcount / input.length;
    };

  }
  connectToSource(stream: any, callback: Function) {
    console.log('SoundMeter connecting');
    try {
      this.mic = this.context.createMediaStreamSource(stream);
      this.mic.connect(this.script);
      // necessary to make sample run, but should not be.
      this.script.connect(this.context.destination);
      if (typeof callback !== 'undefined') {
        callback(null);
      }
    } catch (e) {
      console.error(e);
      if (typeof callback !== 'undefined') {
        callback(e);
      }
    }
  }

  stop() {
    this.mic.disconnect();
    this.script.disconnect();
  }

}