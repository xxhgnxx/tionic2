
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'getHead' })
export class GetHeadPope implements PipeTransform {
    public headPicList: Array<string>;
    constructor() {
        this.headPicList = new Array<string>();
        this.headPicList.push('assets/img/speakers/bear.jpg');
        this.headPicList.push('assets/img/speakers/cheetah.jpg');
        this.headPicList.push('assets/img/speakers/duck.jpg');
        this.headPicList.push('assets/img/speakers/eagle.jpg');
        this.headPicList.push('assets/img/speakers/elephant.jpg');
        this.headPicList.push('assets/img/speakers/giraffe.jpg');
        this.headPicList.push('assets/img/speakers/iguana.jpg');
        this.headPicList.push('assets/img/speakers/kitten.jpg');
        this.headPicList.push('assets/img/speakers/lion.jpg');
        this.headPicList.push('assets/img/speakers/mouse.jpg');
        this.headPicList.push('assets/img/speakers/puppy.jpg');
        this.headPicList.push('assets/img/speakers/rabbit.jpg');
        this.headPicList.push('assets/img/speakers/turtle.jpg');
    }
    transform(value: any): string {
        return this.headPicList[value];
        
    }

}
