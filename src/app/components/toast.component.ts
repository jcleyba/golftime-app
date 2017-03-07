/**
 * Created by juanleyba on 3/7/17.
 */
import {Component, OnInit, Input} from '@angular/core';


@Component({
    selector: 'toast',
    templateUrl: '../templates/toast.component.html',
})
export class ToastComponent {
    @Input() message: string;
    @Input() type: string;

    constructor() {
    }
}