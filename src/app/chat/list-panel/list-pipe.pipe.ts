import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listPipe'
})
export class ListPipePipe implements PipeTransform {

  transform(input, target) {
    if (!input) {
      return [];
    }
    input.forEach(item => {
      if (item.username === target) {
        item.newMessageCount = 0;
      }
    });
    return input;
  }

}
