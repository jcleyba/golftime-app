/**
 * Created by juanleyba on 3/3/17.
 */

import {Component, OnInit} from '@angular/core';
import {AuthService, User} from "../services/auth.service";
import {EventsService} from "../services/events.service";
import {ToastService} from "../services/toast.service";
import {Router, ActivatedRoute} from '@angular/router';


@Component({
    selector: 'events-app',
    templateUrl: '../templates/single-event.component.html',
})
export class SingleEventComponent implements OnInit {
    id: string;
    user: User;
    showSpinner: boolean = false;
    event: any = new Object();
    heading: any;
    rows: any = [];
    alreadyBooked: boolean = false;
    showUsersSelect: boolean = false;
    usersList: any;
    usersIds: any;
    selectedUser: User;

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private toast: ToastService,
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
                if (this.user.role === 1) {
                    this.getUsers();
                }
                else {
                    this.selectedUser = this.user;
                }
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

    getUsers() {
        var self = this;
        this.eventService.getUsers().then((snapshot: any) => {
            self.usersList = snapshot.val();
            self.usersIds = Object.keys(self.usersList);
            self.selectedUser = self.usersList[0];
            this.showUsersSelect = true;
        }).catch((error: any) => {
            console.log(error);
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

        if (!e.id && !this.alreadyBooked && this.hasPermissions(this.user, this.event)) {
            var confirm: any = window.confirm('¿Usted desea inscribirse a las ' + timeString.getHours() + ":" + formatMinute);
            if (confirm) {
                this.sendBooking(this.id, this.selectedUser, e.time);
            }
        }
    }

    sendBooking(id: any, user: any, time: any) {
        this.showSpinner = true;
        this.eventService.saveBooking(id, user, time).then((response: any) => {
            this.initWithEvent(id);
            setTimeout(() => {
                this.toast.create({
                    show: true,
                    message: 'Inscripción exitosa!',
                    severity: 'alert'
                });
            }, 1000);
        }).catch((error: any) => {
            this.showSpinner = false;
            console.log(error)
        })
    }

    removeBooking(id: any) {
        event.stopPropagation();
        if (window.confirm('¿Está seguro de eliminar su inscripción?')) {
            this.eventService.deleteBooking(this.id, id).then((response: any) => {
                this.initWithEvent(this.id);
                this.alreadyBooked = false;
                setTimeout(() => {
                    this.toast.create({
                        show: true,
                        message: 'Inscripción eliminada exitosamente!',
                        severity: 'alert'
                    });
                }, 1000);
            }).catch((error: any) => {
                this.showSpinner = false;
                console.log(error);
            })
        }
    }

    hasPermissions(user: User, event: any) {
        var ret = false;
        var today = new Date();
        var type = user.class;
        var eventTime = new Date(event.date);
        var oneDayDiff = (event.date - today.getTime()) < (24 * 60 * 60 * 1000);
        var weekly = eventTime.getDate() - today.getDate();

        if (type === 0) {
            ret = true
        }
        else {
            if (today.getTime() < (event.date - 7200000) && weekly < 7 && oneDayDiff) {

                ret = true;
            }
            else {
                this.toast.create({
                    show: true,
                    message: 'Usted no está autorizado a inscribirse. Espere al día previo al torneo.',
                    severity: 'error'
                })
            }
        }
        return ret;
    }
}