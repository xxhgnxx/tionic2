import { UserService } from './user-server';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Data } from './datatype'
import { dataLoader } from './data';
import { idgen } from './datatype'
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class SocketService {
    private testmsglist = new Array();
    public isconnected = false;
    public socket: SocketIOClient.Socket;
    @Output() loginResult: EventEmitter<any> = new EventEmitter();
    @Output() videcall: EventEmitter<any> = new EventEmitter();
    @Output() rtcEmitter: EventEmitter<any> = new EventEmitter();
    constructor(public events: Events, public storage: Storage, public userService: UserService) {
        // this.start();
    }
    theGameService: any;
    theMsgService: any;
    /**
   * 初始化过程
   */
    public start(): Promise<any> {
        if (typeof this.socket !== 'undefined' && this.socket.connected) {
            console.log('已经连接');
            return new Promise(resolve => {
                resolve(this.socket.id);
            });

        } else {

            // this.socket = io.connect('http://192.168.1.14:81', { reconnection: false });
            // this.socket = io.connect('http://127.0.0.1:81', {reconnection: false}); this.socket
            this.socket = io.connect('http://hk.airir.com:81', { reconnection: false });
            return new Promise(resolve => {
                let tmptimer = setTimeout(() => {
                    console.log(Date().toString().slice(15, 25), '连接服务器', '失败,重试');
                    this.socket.removeListener('ok');
                    this.start();
                }, 1000);
                this.socket.once('ok', () => {
                    console.log(Date().toString().slice(15, 25), '连接服务器', '成功', this.socket.id);
                    this.isconnected = true;
                    resolve(this.socket.id);
                    clearTimeout(tmptimer);
                    this.init();
                });
            });

        }
    }


    public init() {
        this.socket.on('system', (data: Data) => {
            // console.log('收到数据包', data);
            this.system(data);
        })
    }


    public call(id: string): Promise<any> {
        return new Promise(resolve => {
            let data = new Data('call', id);
            data.toWho = id;
            data.fromWho = this.socket.id;
            this.socket.emit('system', data);
            this.socket.once('answer', (data: Data) => {
                console.log('收到对方回应', data);

                resolve(data.data);
                clearTimeout(tmptimer);
            });
            let tmptimer = setTimeout(() => {
                console.log('等待接通超时');
                this.socket.removeListener('answer');
                resolve(false);
            }, 20000);
        });
    }

    public answer(res: Data) {
        res.fromWho = this.socket.id;

        this.socket.emit('system', res);
    }



    public system(data: Data) {
        // console.log('%csystem', 'background: #93ADAA; color: #000', data);

        dataLoader(this.userService, this.theGameService, this.theMsgService, data);

        switch (data.type) {


            case 'loginSuccess':
                this.events.publish('user:login');
                this.loginResult.emit('认证成功');
                this.userService.isLogin = true;
                break;
            case 'test':
                console.log('测试消息', data);
                break;

            case 'Login_fail':
                this.loginResult.emit('认证失败');
                // myEmitter.emit('user_login_passWrong');
                break;

            case 'updata':
                break;
            case 'call':
                console.log("收到视频请求", data);
                this.videcall.emit(data);
                break;
            case "candidate":
                {
                    this.rtcEmitter.emit(data);
                    break;
                }
            case "desc":
                {
                    this.rtcEmitter.emit(data);
                    break;
                }
            case "testMsg":
                {
                    console.log('testMsg', data);

                    this.testmsglist.push(data);
                    break;
                }


            default:
                console.log(Date().toString().slice(15, 25), '未定义请求');


        }
    }







    public async login(name: string, password: string): Promise<any> {
        console.log(this.socket);
        let started = await this.start();
        return new Promise(resolve => {
            if (started) {
                let logindata = new Data("login", "");
                logindata.name = name;
                logindata.password = password;
                let tmptimer = setTimeout(() => {
                    console.log(this.socket);
                    this.socket.removeListener('login');
                    resolve(-2)
                }, 3000);
                this.socket.once('loginSuccess', () => {
                    console.log(Date().toString().slice(15, 25), '登陆成功');
                    resolve(1);
                    clearTimeout(tmptimer);
                });
                this.send(logindata, this.callbackresout);
            } else {
                resolve(0);
            }
        })

    }

    /**
   * 发送器，data：内容，cb：后续动作入口
   */
    public send(data: Data, cb: Function) {
        data.key = idgen();
        let tmpemit = this.socket.emit('system', data);
        let timeout = setTimeout(() => {
            tmpemit.close();
            cb(false);
        }, 2000);
        this.socket.once(data.key, () => {
            clearTimeout(timeout);
            this.socket.off(data.key);
            cb(true);
        });
    }

    /**
   * 无反馈消息
   */
    public emit(data: Data) {
        this.socket.emit('system', data);
    }


    /**
    * 消息默认cb
    */
    callbackresout(res: boolean) {
        console.log('消息反馈', res);
        if (res) { } else {
            console.log('断线!');
        }
    }



}
