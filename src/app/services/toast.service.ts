/**
 * Created by juancruz on 3/7/17.
 */
import {Injectable, Input} from "@angular/core";
import {Subject, Observable}from "rxjs";


@Injectable()
export class ToastService {
    showToast: Observable<Object>;

    private boolSubject: Subject<Object>;

    constructor() {
        this.boolSubject = new Subject<Object>();
        this.showToast = this.boolSubject.asObservable();
    }

    create(newValue: any) {
        this.showToast = newValue;
        this.boolSubject.next(newValue);
    }

    hide(newValue: any) {
        this.showToast = newValue;
        this.boolSubject.next(newValue);
    }
}