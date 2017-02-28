
// 用户 数据结构
export class User {
  socketId: string = 'x';
  isOnline: boolean = true;
  isSurvival: boolean = true;
  isSeat: boolean = false;
  seatNo: number = 0;
  name: string;
  hitler: User;
  fascist1: User;
  fascist2: User;
  fascist3: User;
  videoFree = true;
  password: string;
  isLastPre: boolean = false;
  isLastPrm: boolean = false;
  isPre: boolean = false;
  isPrm: boolean = false;
  isTmpPrm: boolean = false;
  isHitler: boolean = false;
  isFascist: boolean = false;
  role: string = 'x';
  canBeSelect: boolean = true;
  lastVote: number;  // 最后一次生效的投票情况
  constructor(name: string) {
    this.name = name;
  }
}





// 测试数据
export let userLsitTestdata: User[] = [
  new User('传说中的第1人'),
  new User('我是本届总统'),
  new User('上届总理'),
  new User('上届总统'),
  new User('希特勒'),
  new User('-( ゜- ゜)つロ乾杯~'),
  new User('这个人的名字有十个字'),
  new User('真·皇冠鸟'),
  new User('这人被枪毙了'),
  new User('第八人'),
  new User('阿依吐拉公主')
];


export function getdate() {
  userLsitTestdata[1].isPre = true;
  userLsitTestdata[2].isLastPrm = true;
  userLsitTestdata[3].isLastPre = true;
  userLsitTestdata[8].isSurvival = false;
  userLsitTestdata[4].isHitler = true;
  userLsitTestdata[7].isFascist = true;
  userLsitTestdata[8].isFascist = true;


  return this.userLsitTestdata;
}
