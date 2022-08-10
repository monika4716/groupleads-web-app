import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'counterdisplayformat'
})
export class CounterdisplayformatPipe implements PipeTransform {

  transform(value: any): unknown {

    if(value > 999){
      return  Math.floor(value/1000)+'K+';
    }else{
      return value;
    }

   
  }

}
