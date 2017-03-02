/**
 * Created by juanleyba on 3/1/17.
 */
import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {RouterModule, Router} from '@angular/router';


@Component({
    selector: 'events-app',
    templateUrl: '../templates/events.component.html',
})
export class EventsComponent {
    constructor(private authService: AuthService,
                private router: Router) {

        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['login']);
        }
    }
}