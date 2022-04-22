import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPackageFilter'
})
export class CustomPackageFilterPipe implements PipeTransform {

  transform(items: any[], filter: any): any {debugger
    if (!items || !filter) {
        return items;
    }
    return items.filter(item => item.title.indexOf(filter.title) !== -1);
}

}
