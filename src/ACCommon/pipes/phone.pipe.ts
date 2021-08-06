
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phoneValue: number ): any {
    try {
      let result = '';
      let phone = `${phoneValue}`;
      phone = phone.replace(/[^0-9]/g, '');

      if (phone.length > 11 || phone.length < 10) {
        console.log('Is not a phone number.');
        return phone;
      }

      if (phone.length === 11) {
        result = '+' + phone.slice(0, 1) + ' (' + phone.slice(1, 4) + ') ' + phone.slice(4, 7) + '-' + phone.slice(7, 11);
      }

      if (phone.length === 10) {
        result = '(' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + '-' + phone.slice(6, 10);
      }

      return result;
    } catch (error) {
      console.log('PhonePipe Error:', error);
      return phoneValue;
    }
  }
}
