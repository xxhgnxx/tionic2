//  本地用户列表更新服务 用于维护本地用户列表
import { Injectable } from '@angular/core';
import { User } from './user';
import { SocketService } from './socket-server';
import { Data } from './datatype'
import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';



@Injectable()
export class WebrtcService {
    private rtcEmitter: EventEmitter<any>;
    public stream_l: any;
    public localstream: MediaStream;
    public stream_l_unsave: any;
    public stream_r: any;
    public thispc: any
    private iceServer = {
        "iceServers": [
            { "url": "stun:hk.airir.com" },
            {
                "url": "turn:hk.airir.com",
                "username": "123",
                "credential": "123"
            }]
    };
    private pclist = new Map<string, any>();
    constructor(private socket: SocketService, public domSanitizer: DomSanitizer) {
        this.rtcEmitter = this.socket.rtcEmitter.subscribe((data: Data) => {
            // console.log('收到数据包', data);
            if (data.type === 'desc') {
                // console.log('收到desc', data);

                this.setdesc(data);
                return;
            }
            if (data.type === 'candidate') {
                // console.log('收到数据candidate', data);
                this.setcandidate(data);
                return;
            }
        });

    }
    init(mediaOptions: any, who_id: string, youareoffer: boolean) {

        let pc = new (<any>window).RTCPeerConnection(this.iceServer);
        console.log('初始化链接');

        this.pclist.set(who_id, pc);
        pc.onicecandidate = (evt: any) => {
            // console.log('获取candidate');
            if (evt.candidate) {
                let tmp = new Data('candidate', evt.candidate)
                tmp.fromWho = this.socket.socket.id;
                tmp.toWho = who_id;
                this.socket.emit(tmp);
                // console.log('send icecandidate');
            };
        };
        // console.log('youareoffer', youareoffer);



        console.log('获取本地流');
        if (!navigator.getUserMedia) {
            navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;;
        }
        if (!navigator.getUserMedia) {
            console.log('getUserMedia not supported in this browser.');
        }
        navigator.getUserMedia(mediaOptions, (stream: MediaStream) => {
            this.thispc = pc;
            this.localstream = stream;
            pc.addStream(stream);
            // this.stream_l_unsave = window.URL.createObjectURL(stream);
            // this.stream_l = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(stream));
            this.socket.videcall.emit(new Data('local', stream));
            // pc.addStream(new MediaStream());
            // console.log("待发送流绑定ok", stream);
            pc.onaddstream = (e: any) => {
                console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx收到远端流，绑定');
                console.log(e.stream);
                // console.log(e.stream.active);
                // console.log(e);
                this.socket.videcall.emit(new Data('remote', e));
                // this.remoteVideo.nativeElement.src = URL.createObjectURL(e.stream);
                // this.stream_r = this.domSanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(e.stream));
                // this.stream_r = window.URL.createObjectURL(e.stream);

            };
            if (youareoffer) {
                pc.createOffer().then(
                    (desc: any) => {
                        // console.log('createOffer成功');
                        pc.setLocalDescription(desc).then(
                            () => {
                                // console.log('设置本地desc成功_Offer_desc', desc);
                                let tmp = new Data('desc', desc)
                                tmp.id_answer = who_id;
                                tmp.id_offer = this.socket.socket.id;
                                tmp.from_offer = true;
                                tmp.toWho = who_id;
                                // console.log('发送desc', tmp);
                                this.socket.emit(tmp);
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
            }
        }, function (e) {
            console.log(e);
        });





    }

    close(id: string) {
        let pc = this.pclist.get(id);
        // this.localstream.stop();
        pc.close();
        let data = new Data('rtcend', id)
        data.toWho = id;
        // console.log('发送desc', tmp);
        this.socket.emit(data);
    }

    public setdesc(data: Data) {
        // console.log('收到desc', data.data);
        let pc: any
        if (data.from_offer) {
            pc = this.pclist.get(data.id_offer);
        } else {
            pc = this.pclist.get(data.id_answer);
        }
        pc.setRemoteDescription(new (<any>window).RTCSessionDescription(data.data)).then(
            () => {
                // console.log('设置远端desc成功');
                if (data.from_offer) {
                    pc.createAnswer().then(
                        (desc: any) => {
                            // console.log('createAnswer成功');
                            pc.setLocalDescription(desc).then(
                                () => {
                                    // console.log('answer_desc_设置本地desc成功', desc);
                                    data.from_offer = false;
                                    data.toWho = data.id_offer;
                                    data.data = desc;
                                    // console.log('发送desc', data);
                                    this.socket.emit(data);
                                },
                                (err: any) => console.log('setLocalDesc错误', err));
                        },
                        (err: any) => console.log('createAnswer错误', err));
                } else { };
            },
            (err: any) => console.log('setRemoteDesc错误', err));
    }

    public setcandidate(data: Data) {
        this.pclist.get(data.fromWho).addIceCandidate(data.data).then(
            function () {
                // console.log('addIceCandidate', data.data);
            },
            function (err: any) {
                console.log(err);
                console.log(data);
            });
    }
}

