/**
 * Created by juanleyba on 3/1/17.
 */
import {Component, OnInit, Input, SimpleChange} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {RouterModule, Router} from '@angular/router';


@Component({
    selector: 'header-app',
    templateUrl: '../templates/header.component.html',
})
export class HeaderComponent {
    isLoggedIn: boolean = false;
    greeting: string = "";
    @Input() user: any = {};
    isAdmin: boolean = false;
    showSpinner: boolean = false;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        this.user = changes['user'].currentValue;
        this.isLoggedIn = this.user ? true : false;
        this.isAdmin = this.user ? this.user.role === 1 : false;
        this.greeting = "Bienvenido";
    }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigate(["/login"]);
        }).catch((error: any) => {
            console.log(error);
        });
    }
}