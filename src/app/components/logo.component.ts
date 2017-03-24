/**
 * Created by juanleyba on 3/24/17.
 */
import {Component} from '@angular/core';

@Component({
    selector: 'logo-app',
    template: `
        <a [routerLink]="['/']">
            <img src="../../public/images/logo.svg" alt="golftime-logo" class="logo">
        </a>`
})
export class LogoComponent {
}