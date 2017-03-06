/**
 * Created by juanleyba on 3/1/17.
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, User} from '../services/auth.service';
import {EventsService} from '../services/events.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'create-tournaments-app',
    templateUrl: '../templates/create-event.component.html',
})
export class CreateEventComponent {
    myForm: FormGroup;
    user: User;
    numberOfPlayers: Array<Number> = [2, 3, 4];
    teeTimesIntervals: any = [];
    hours: any = [];
    minutes: any = [];
    showSpinner: boolean = false;
    showAfternoon: boolean = false;
    addTee: boolean = false;

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private router: Router,
                private fb: FormBuilder) {
        this.initWithUser = this.initWithUser.bind(this);
        this.initWithUser();
        this.initDropdowns();

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
        this.eventService.createEvent(event).then((response: any) => {
            this.showSpinner = false;
            console.log(response);
            alert("Torneo creado!");
        }).catch((error: any) => {
            this.showSpinner = false;
            console.log(error);
        })

    }
}