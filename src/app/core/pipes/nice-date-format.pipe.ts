import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'niceDateFormatPipe'
})
export class NiceDateFormatPipe implements PipeTransform {

//   transform(value: string) {

//     var _value = Number(value);

//     var dif = Math.floor( ( (Date.now() - _value) / 1000 ) / 86400 );

//     if ( dif < 30 ){
//          return this.convertToNiceDate(value);
//     } else {
//         var datePipe = new DatePipe("en-US");
//         var newvalue = datePipe.transform(value, 'MMM-dd-yyyy');

//         if(newvalue!=null || newvalue != undefined)
//           return newvalue;

//         return value;
//     }
//  }

//  convertToNiceDate(time: string) {
//     var date = new Date(time),
//       diff = (((new Date()).getTime() - date.getTime()) / 1000),
//       daydiff = Math.floor(diff / 86400);

//     if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31)
//       return '';

//     return daydiff == 0 && (
//       diff < 60 && "Just now" ||
//       diff < 120 && "1 minute ago" ||
//       diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
//       diff < 7200 && "1 hour ago" ||
//       diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
//       daydiff == 1 && "Yesterday" ||
//       daydiff < 7 && daydiff + " days ago" ||
//       daydiff < 31 && Math.ceil(daydiff / 7) + " week(s) ago";
//   }

transform(date: string) {
  let value = new Date(date);
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

     if (value.getFullYear() == today.getFullYear() && value.getMonth() == today.getMonth() && value.getDate() == today.getDate())
     return "Today";
   else if (value.getFullYear() == yesterday.getFullYear() && value.getMonth() == yesterday.getMonth() && value.getDate() == yesterday.getDate())
     return "Yesterday";
  else{
    return (new DatePipe("en-US")).transform(value, 'dd/MM/yyyy');
  }
}

}


