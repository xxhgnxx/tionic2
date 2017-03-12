import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { UserData } from '../../providers/user-data';
import { UserService } from '../../providers/user-server';
import { SocketService } from '../../providers/socket-server';

@Component({ selector: 'page-user', templateUrl: 'login.html' })
export class LoginPage {
  login: {
    username?: string,
    password?: string
  } = {};
  submiting = false;
  popmsg = "";
  constructor(public navCtrl: NavController, public socketService: SocketService, public userService: UserService) {
    if (this.userService.isLogin) {
      this.navCtrl.push(TabsPage);
      console.log('插入tab页');
    } else {
      this.socketService.start();
      // this.tologin(Math.round(Math.random()*100).toString(),"1");
    }

  }
  test() {
    console.log(this.socketService.isconnected);

  }
  onLogin(form: NgForm) {
    if (form.valid) {
      this.submiting = true;
      this.tologin(this.login.username, this.login.password);

    }
  }

  tologin(name: string, password: string) {
    this.submiting = true;
    this.socketService.login(name, password);
    let sub = this.socketService.loginResult.subscribe((result: string) => {
      if (result === '认证成功') {
        console.log('登陆成功');
        this.userService.myname = name;
        this.userService.isLogin = true;
        this.navCtrl.push(TabsPage);
      } else {
        this.submiting = false;
        if (result === '认证失败') {
          this.popmsg = this.userService.other;
        } else {
          this.popmsg = "账户或密码错误";
        }
        setTimeout(() => this.popmsg = '', 3000);
        // this.socketsevice.disconnect();
        console.log('认证失败');
      }
      sub.unsubscribe();
    });
  }


  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
