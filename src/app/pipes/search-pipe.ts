/**
 * Created by juanleyba on 3/30/17.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'searchPipe',
})
export class SearchPipe implements PipeTransform {
    public transform(value: any, key: string, term: string) {
        return value.filter((item: any) => {
            if (item.hasOwnProperty(key)) {
                if (term) {
                    let regExp = new RegExp('\\b' + term, 'gi');
                    return regExp.test(item[key]);
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
    }
}