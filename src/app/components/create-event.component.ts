/**
 * Created by juanleyba on 3/1/17.
 */
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AuthService, User} from '../services/auth.service';
import {EventsService} from '../services/events.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

class Event {
    id: string;
    name: string;
    date: any;
    teeTimesIntervals: any;
    morningShiftStartHours: any;
    morningShiftStart: any;
    morningShiftEnd: any;
    morningShiftStartMinutes: any;
    morningShiftEndHours: any;
    morningShiftEndMinutes: any;
}

@Component({
    selector: 'create-tournaments-app',
    templateUrl: '../templates/create-event.component.html',
})
export class CreateEventComponent implements OnInit {
    eventId: string;
    myForm: FormGroup;
    event: Event;
    user: User;
    hours: any = [];
    minutes: any = [];
    numberOfPlayers: Array<Number> = [2, 3, 4];
    teeTimesIntervals: any = [];
    showSpinner: boolean = false;
    showAfternoon: boolean = false;
    addTee: boolean = false;

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder) {
        this.initWithUser = this.initWithUser.bind(this);
        this.initDropdowns();
        this.event = new Event();
        this.route.queryParams.subscribe((params: Params) => {
            var id = params['id'];
            if (id) {
                this.eventId = id;
                this.preloadEvent(id);
            }
        });

        this.myForm = this.fb.group({
            name: ['', Validators.required],
            date: ['', Validators.required],
            teeTimesIntervals: ['', Validators.required],
            numberOfPlayers: ['', Validators.required],
            morningShiftStartHours: ['', Validators.required],
            morningShiftStartMinutes: ['', Validators.required],
            morningShiftEndHours: ['', Validators.required],
            morningShiftEndMinutes: ['', Validators.required],
            afternoonShiftStartHours: [''],
            afternoonShiftStartMinutes: [''],
            afternoonShiftEndHours: [''],
            afternoonShiftEndMinutes: [''],
            showAfternoonInput: [''],
            addTee: [''],
        });
    }

    ngOnInit() {
        this.initWithUser();
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

    initDropdowns() {
        for (var i = 1; i < 31; i++) {
            this.teeTimesIntervals.push(i);
        }
        for (var i = 0; i < 24; i++) {
            this.hours.push(i);
        }
        for (var i = 0; i < 60; i++) {
            this.minutes.push(i);
        }
    }

    formatTime(date: any, hours: any, minutes: any) {
        date.setHours(hours);
        date.setMinutes(minutes);
        return date.getTime();
    }

    preloadEvent(id: any) {
        this.eventService.getSingleEvent(id).then((event: any) => {
            this.event = event.val();
            var dateString = new Date(this.event.date);
            var month = (dateString.getMonth() + 1).toString().length == 1 ? "0" + (dateString.getMonth() + 1).toString() : (dateString.getMonth() + 1).toString();
            var day = (dateString.getDate()).toString().length == 1 ? "0" + dateString.getDate() : dateString.getDate();
            this.event.date = dateString.getFullYear() + "-" + month + "-" + day;
            this.event.morningShiftStartHours = new Date(this.event.morningShiftStart).getHours();
            this.event.morningShiftStartMinutes = new Date(this.event.morningShiftStart).getMinutes();
            this.event.morningShiftEndHours = new Date(this.event.morningShiftEnd).getHours();
            this.event.morningShiftEndMinutes = new Date(this.event.morningShiftEnd).getMinutes();
        }).catch((error: any) => {
            console.log(error);
        })
    }

    addEvent() {
        this.showSpinner = true;
        var value = this.myForm.value;
        var date = new Date(value.date);
        var event = {
            name: value.name,
            date: date.getTime(),
            numberOfPlayers: value.numberOfPlayers,
            teeTimesInterval: value.teeTimesIntervals,
            morningShiftStart: this.formatTime(date, value.morningShiftStartHours, value.morningShiftStartMinutes),
            morningShiftEnd: this.formatTime(date, value.morningShiftEndHours, value.morningShiftEndMinutes),
            afternoonShiftStart: this.formatTime(date, value.afternoonShiftStartHours, value.afternoonShiftStartMinutes),
            afternoonShiftEnd: this.formatTime(date, value.afternoonShiftEndHours, value.afternoonShiftEndMinutes),
            shifts: this.addTee ? 2 : 1
        };
        var key = this.eventId ? this.eventId : this.eventService.generateNewKeyForEvent();
        this.eventService.createEvent(key, event).then((response: any) => {
            this.showSpinner = false;
            this.router.navigate(['/torneo', key])
        }).catch((error: any) => {
            this.showSpinner = false;
            console.log(error);
        })

    }
}