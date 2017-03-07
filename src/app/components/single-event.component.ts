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
export class SingleEventComponent implements OnInit {
    id: string;
    userId: string;
    user: User;
    showSpinner: boolean = false;
    event: any = new Object();
    heading: any;
    rows: any = [];
    alreadyBooked: boolean = false;

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private router: Router,
                private route: ActivatedRoute) {
        this.initWithUser = this.initWithUser.bind(this);
        this.initWithEvent = this.initWithEvent.bind(this);

        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }

    ngOnInit() {
        this.initWithUser();
        this.initWithEvent(this.id);
    }

    initWithUser() {
        if (this.authService.isAuthenticated()) {
            this.showSpinner = true;
            this.authService.getUser().then((snapshot: any) => {
                this.user = snapshot.val();
                this.user.id = snapshot.key;
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
        var self = this;
        this.showSpinner = true;
        this.eventService.getSingleEvent(id).then((snapshot: any) => {
            self.event = snapshot.val();
            self.drawTable(self.event);
            self.showSpinner = false;
        }).catch((error: any) => {
            console.log(error);
            self.showSpinner = false;
        })
    }

    drawTable(event: any) {
        this.heading = [];
        for (var i = 1; i < parseInt(event.numberOfPlayers) + 1; i++) {
            this.heading.push(i);
        }
        this.rows = [];
        this.drawShift(event, event.morningShiftStart, event.morningShiftEnd);
        if (event.afternoonShiftStart > 0) {
            this.drawShift(event, event.afternoonShiftStart, event.afternoonShiftEnd);
        }
    }

    drawShift(event: any, startTime: any, endTime: any) {
        while (startTime < endTime) {
            var array: any = [];
            for (var i = 1; i < parseInt(event.numberOfPlayers) + 1; i++) {
                array = this.findBooking(event.bookings, startTime);
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

    findBooking(list: any, time: any) {
        var arr: any = [];
        var keys = list ? Object.keys(list) : [];
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
        var timeString = new Date(e.time);
        var formatMinute = timeString.getMinutes().toString().length == 1 ? '0' + timeString.getMinutes() : timeString.getMinutes();
        var confirm: any = window.confirm('¿Usted desea inscribirse a las ' + timeString.getHours() + ":" + formatMinute);

        if (!e.id && !this.alreadyBooked && confirm) {
            this.eventService.saveBooking(this.id, this.user, e.time).then((response: any) => {
                this.initWithEvent(this.id);
            }).catch((error: any) => {
                this.showSpinner = false;
                console.log(error)
            })
        }
        else if (!e.id && this.alreadyBooked) {
            alert('Usted ya está inscripto.');
        }

    }

    removeBooking(id: any) {
        event.stopPropagation();
        if (window.confirm('¿Está seguro de eliminar su inscripción?')) {
            this.eventService.deleteBooking(this.id, id).then((response: any) => {
                this.initWithEvent(this.id);
                this.alreadyBooked = false;
            }).catch((error: any) => {
                this.showSpinner = false;
                console.log(error);
            })
        }
    }
}