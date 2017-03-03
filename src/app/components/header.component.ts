/**
 * Created by juanleyba on 3/1/17.
 */
/**
 * Created by juanleyba on 3/1/17.
 */
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {RouterModule, Router} from '@angular/router';


@Component({
    selector: 'header-app',
    templateUrl: '../templates/header.component.html',
})
export class HeaderComponent {
    isLoggedIn: boolean = false;
    greeting: string = "";
    user: any = {};
    isAdmin: boolean = false;
    showSpinner: boolean = false;

    constructor(private authService: AuthService,
                private router: Router) {
        this.showSpinner = true;
        if (this.authService.isAuthenticated()) {
            this.authService.getUser().then((snapshot: any) => {
                if (snapshot) {
                    if (snapshot.val().role === 1) {
                        this.isAdmin = true;
                    }
                    else {
                        this.isAdmin = false;
                    }
                    this.isLoggedIn = true;
                    this.showSpinner = false;
                }
            });

            this.authService.getUser().then((snapshot: any) => {
                this.user = snapshot.val();
                this.greeting = "Bienvenido";
                this.showSpinner = false;
            }).catch((error: any) => {
                console.log(error);
                this.showSpinner = false;
            });
        }
    }

    logout() {
        this.authService.logout().then(() => {
            this.router.navigate(["/login"]);
        }).catch((error: any) => {
            console.log(error);
        });
    }
}