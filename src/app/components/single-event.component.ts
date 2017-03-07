/**
 * Created by juanleyba on 3/3/17.
 */

import {Component, OnInit} from '@angular/core';
import {AuthService, User} from "../services/auth.service";
import {EventsService} from "../services/events.service";
import {Router, ActivatedRoute} from '@angular/router';
import {start} from "repl";


@Component({
    selector: 'events-app',
    templateUrl: '../templates/single-event.component.html',
})
export class SingleEventComponent {
    id: string;
    userId: string;
    user: User;
    showSpinner: boolean = false;
    event: any = new Object();
    heading: any = [];
    rows: any = [];
    alreadyBooked: boolean = false;

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
                this.user.id = snapshot.key;
                console.log(this.userId);
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
    }

    drawShift(event: any, startTime: any, endTime: any) {
        while (startTime < endTime) {
            var array: any = [];
            for (var i = 1; i < parseInt(event.numberOfPlayers) + 1; i++) {
                array = this.findBooking(startTime);
                for (var j = array.length; j < i; j++) {
                    array[j] = {id: null, time: startTime, user: {name: ""}};
                }
            }
            var obj = {
                time: new Date(startTime),
                content: array
            };
            this.rows.push(obj);
            startTime += (event.teeTimesInterval * 60000);
        }
    }

    findBooking(time: any) {
        var arr: any = [];
        var keys = this.event.bookings ? Object.keys(this.event.bookings) : [];
        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            var obj: any = new Object();
            if (parseInt(this.event.bookings[id].time) === time) {
                obj.id = id;
                obj.user = this.event.bookings[id].user;
                obj.time = time;
                this.alreadyBooked = obj.user.id === this.user.id;
                arr.push(obj);
            }


        }
        return arr;
    }

    addBooking(e: any) {
        if (!e.id && !this.alreadyBooked) {
            console.log(e);
            this.eventService.saveBooking(this.id, this.user, e.time).then((response: any) => {
                console.log(response);
            }).catch((error: any) => {
                console.log(error)
            })
        }
    }
}