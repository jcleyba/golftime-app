/**
 * Created by juanleyba on 4/11/17.
 */
import {Injectable, Input} from "@angular/core";
import {Http} from "@angular/http";
import {Subject, Observable}from "rxjs";


@Injectable()
export class ReCaptchaService {
    constructor(private http: Http) {
    }

    url: string = '/recaptcha';

    sendCaptcha(json:any) {
        return this.http.post(this.url, json).toPromise();
    }
}