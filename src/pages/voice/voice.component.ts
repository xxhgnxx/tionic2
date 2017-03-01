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

@Component({ selector: 'voice', templateUrl: 'voice.component.html' })
export class VoiceComponent {
  private instantMeter: any = document.querySelector('#instant meter');

  private instantValueDisplay: any = document.querySelector('#instant .value');

  public myvalue = 0.2;
  private localStream: any;
  private soundMeter: any;
  private step = 0;
  private AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
  private audioContext = new AudioContext();
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
      this.myvalue = 0.5;
      let audio = document.querySelector('#localaudio');
      console.log(stream);
      this.localStream = stream;
      (<any>audio).src = window.URL.createObjectURL(stream);


      // let source = this.audioContext.createScriptProcessor(2048, 1, 1)
      // source.onaudioprocess = (e: any) => {
      //   var input = e.inputBuffer.getChannelData(0);
      //   var i;
      //   var sum = 0.0;
      //   var clipcount = 0;
      //   for (i = 0; i < input.length; ++i) {
      //     sum += input[i] * input[i];
      //     if (Math.abs(input[i]) > 0.99) {
      //       clipcount += 1;
      //     }
      //   }
      //   this.myvalue = Math.sqrt(sum / input.length);
      //   console.log('xxxx', this.myvalue);

      // }
      // this.audioContext.createMediaStreamSource(stream).connect(source);;
      // source.connect(this.audioContext.destination);

      this.soundMeter = new SoundMeter(this.audioContext);
      this.soundMeter.connectToSource(stream, (e: any) => {
        if (e) {
          alert(e);
          return;
        }
      });
    }, function (e) {
      console.log(e);
    });

    setInterval(() => {
      this.myvalue = this.soundMeter.instant;
    }, 200);


  }





  test() {

    setInterval(() => {
      console.log('xxxxxxx', this.soundMeter.instant);
      this.myvalue = this.soundMeter.instant;
      console.log(this.myvalue);
    }, 200);
    // this.instantValueDisplay.innerText = this.soundMeter.instant.toFixed(2);
  }

  ngOnDestroy() {
    console.log('垃圾清理');

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



// SoundMeter.prototype.connectToSource = function (stream, callback) {
//   console.log('SoundMeter connecting');
//   try {
//     this.mic = this.context.createMediaStreamSource(stream);
//     this.mic.connect(this.script);
//     // necessary to make sample run, but should not be.
//     this.script.connect(this.context.destination);
//     if (typeof callback !== 'undefined') {
//       callback(null);
//     }
//   } catch (e) {
//     console.error(e);
//     if (typeof callback !== 'undefined') {
//       callback(e);
//     }
//   }
// };
// SoundMeter.prototype.stop = function () {
//   this.mic.disconnect();
//   this.script.disconnect();
// };