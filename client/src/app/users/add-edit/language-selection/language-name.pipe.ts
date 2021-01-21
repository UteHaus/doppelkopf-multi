import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageName',
})
export class LanguageNamePipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'de':
        return 'Deutsch';
      case 'hsb':
        return 'Serbsce';
      case 'en':
        return 'English';

      default:
        return '';
    }
  }
}
