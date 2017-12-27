/**
 * Created by juanleyba on 3/7/17.
 */
import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {ToastService} from '../services/toast.service'

interface Options {
    show: boolean;
    message: string;
    severity: string;
}

@Component({
    selector: 'toast',
    templateUrl: '../templates/toast.component.html',
})
export class ToastComponent implements OnInit, OnDestroy {
    message: string;
    classes: any = [];
    subscription: Subscription;

    constructor(private toastService: ToastService) {

    }

    ngOnInit() {
        this.subscription = this.toastService.showToast.subscribe((options: Options) => {
            this.message = options.message;
            if (options.show) {
                setTimeout(() => {
                    this.classes = 'hide';
                }, 3000)
            }
            this.classes = [];
            this.classes.push(options.show.toString() ? 'show' : '');
            this.classes.push(options.severity.toString());
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}