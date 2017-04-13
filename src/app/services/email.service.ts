/**
 * Created by juanleyba on 4/13/17.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

const EMAIL_ENDPOINT = '/sendEventTimeEmail';
@Injectable()
export class EmailService {
    constructor(private http: Http) {

    }

    sendEventTimeEmail(json: any) {
        return this.http.post(EMAIL_ENDPOINT, json).toPromise();
    }
}