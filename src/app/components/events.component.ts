/**
 * Created by juanleyba on 3/1/17.
 */
import {Component, OnInit} from '@angular/core';
import {AuthService, User} from "../services/auth.service";
import {EventsService} from "../services/events.service";
import {ToastService} from "../services/toast.service";
import {Router} from '@angular/router';


@Component({
    selector: 'events-app',
    templateUrl: '../templates/events.component.html',
})
export class EventsComponent implements OnInit {
    user: User;
    showSpinner: boolean = false;
    events: any;
    eventsKeys: any;

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private toast: ToastService,
                private router: Router) {
        this.initWithUser = this.initWithUser.bind(this);
        this.initWithEvents = this.initWithEvents.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
    }

    ngOnInit() {
        this.initWithUser();
        this.initWithEvents();
    }

    initWithUser() {
        if (this.authService.isAuthenticated()) {
            this.showSpinner = true;
            this.authService.getUser().then((snapshot: any) => {
                this.user = snapshot.val();
                this.showSpinner = false;
            }).catch((error: any) => {
                console.log(error);
                this.showSpinner = false;
            })
        }
        else {
            this.router.navigate(['login']);
        }
    }

    initWithEvents() {
        this.eventService.getEventsList().then((snapshot: any) => {
            this.eventsKeys = Object.keys(snapshot.val() || {});
            this.events = snapshot.val();
        }).catch((error: any) => {
            console.log(error)
        })
    }

    removeEvent(key: any) {
        this.showSpinner = true;
        this.eventService.deleteEvent(key).then((response: any) => {
            this.initWithEvents();
            this.showSpinner = false;
            this.toast.create({
                show: true,
                message: 'Torneo eliminado!',
                severity: 'alert'
            })
        }).catch((error: any) => {
            this.showSpinner = false;
            this.toast.create({
                show: true,
                message: error.message,
                severity: 'error'
            })
        })
    }
}