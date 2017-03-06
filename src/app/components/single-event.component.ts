/**
 * Created by juanleyba on 3/3/17.
 */

import {Component, OnInit} from '@angular/core';
import {AuthService, User} from "../services/auth.service";
import {EventsService} from "../services/events.service";
import {Router, ActivatedRoute} from '@angular/router';


@Component({
    selector: 'events-app',
    templateUrl: '../templates/single-event.component.html',
})
export class SingleEventComponent {
    id: string;
    user: User;
    showSpinner: boolean = false;
    event: any = new Object();
    heading: any = [];
    rows: any = [];

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private router: Router,
                private route: ActivatedRoute) {
        this.initWithUser = this.initWithUser.bind(this);
        this.initWithUser();

        this.route.params.subscribe(params => {
            this.id = params['id'];
            this.initWithEvent(this.id);
        });
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

    initWithEvent(id: string) {
        this.showSpinner = true;
        this.eventService.getSingleEvent(id).then((snapshot: any) => {
            this.event = snapshot.val();
            console.log(this.event);
            this.drawTable(this.event);
            this.showSpinner = false;
        }).catch((error: any) => {
            console.log(error);
            this.showSpinner = false;
        })
    }

    drawTable(event: any) {
        for (var i = 1; i < parseInt(event.numberOfPlayers) + 1; i++) {
            this.heading.push(i);
        }
        this.drawShift(event, event.morningShiftStart, event.morningShiftEnd);
        if (event.afternoonShiftStart > 0) {
            this.drawShift(event, event.afternoonShiftStart, event.afternoonShiftEnd);
        }

        console.log(this.heading)
    }

    drawShift(event: any, startTime: any, endTime: any) {
        while (startTime < endTime) {
            var array: any = [];
            var date = new Date(startTime);
            array[0] = date.getHours() + ":" + this.formatMinutes(date.getMinutes().toString());
            for (var i = 1; i < parseInt(event.numberOfPlayers) + 1; i++) {
                array[i] = "";
            }
            this.rows.push(array);
            startTime += (event.teeTimesInterval * 60000);
        }
    }

    formatMinutes(minutes: string) {
        return minutes.length == 1 ? '0' + minutes : minutes;
    }
}