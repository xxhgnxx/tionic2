//  本地用户列表更新服务 用于维护本地用户列表
import { Injectable } from '@angular/core';
import { User } from './user';
import { Data } from './data';


@Injectable()
export class UserService {
  hList = new Userlisthgn(); // 系统用户总表存储位置
  userList: Array<User>;
  myname = 'x';
  // userLsit = getdate();
  yourself: User = new User('x');
  yourHead: string;
  role: string = 'x';
  teamMsg = '游戏尚未开始';
  isLogin = false;
  other = 'what? 出Bug啦！';
  // whoAmI(list: Array<User>) {
  //   let tmp = list.filter(t => {
  //     return t.socketId === this.yourself.socketId;
  //   })[0];
  //   if (tmp) {
  //     this.yourself = tmp;
  //   } else {
  //     console.log('列表里没你,你离开座位了？');
  //   }
  //   // console.log(this.yourself);
  // }


  setTeam(data: Data) {
    this.role = data.role;
    if (this.role === 'Liberal') {
      this.teamMsg = '你是自由党，你什么都不知道';
    } else {
      if (this.role === 'Fascist') {
        this.teamMsg = '你是：法西斯 ';

        if (data.other.length > 1) {
          for (let i = 0; i < data.other.length; i++) {
            if (data.other[i].socketId !== this.yourself.socketId) {
              this.teamMsg = this.teamMsg + data.other[i].name + ' ';
            }
          }
          this.teamMsg = this.teamMsg + ' 是你的法西斯队友 ';
        }

        this.teamMsg = this.teamMsg + data.target.name + '是希特勒 ';

      } else {
        this.teamMsg = '你是：希特勒';
        if (typeof data.other === 'undefined') {
          this.teamMsg = this.teamMsg + ' 你并不知道谁是你的队友';
        } else {
          for (let i = 0; i < data.other.length; i++) {
            this.teamMsg = this.teamMsg + data.other[i].name + ' ';
          }
          this.teamMsg = this.teamMsg + '是你的法西斯队友 ';
        }
      }
    }

  }

  constructor() { }
}


export class Userlisthgn {
  userList = new Array<User>();
  playerList = new Array<User>();
  yourself: User;
}
