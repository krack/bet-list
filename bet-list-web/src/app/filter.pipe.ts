import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterStatus',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(value: Array<any>, status?: String): Array<any> {
    if(value){
      return value.filter(obj => obj.status === status);
    }else{
      return undefined;
    }
  }

}
