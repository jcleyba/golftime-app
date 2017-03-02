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
    user: any = {};

    constructor(private authService: AuthService,
                private router: Router) {
        if (this.authService.isAuthenticated()) {
            this.isLoggedIn = true;
            this.authService.getUser().then((snapshot: any) => {
                this.user = snapshot.val();
            }).catch((error: any) => {
                console.log(error);
            })
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}