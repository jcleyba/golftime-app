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
    showSpinner: boolean = false;

    constructor(private authService: AuthService,
                private eventService: EventsService,
                private router: Router,
                private fb: FormBuilder) {
        this.initWithUser = this.initWithUser.bind(this);
        this.initWithUser();

        this.myForm = this.fb.group({
            name: ['', Validators.required],
            date: ['', Validators.required],
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

    addEvent() {
        this.showSpinner = true;
        var value = this.myForm.value;
        var event = {
            name: value.name,
            date: new Date(value.date).getTime()
        }
        console.log(event);
        this.eventService.createEvent(event).then((response: any) => {
            this.showSpinner = false;
            alert("Torneo creado!");
        }).catch((error: any) => {
            this.showSpinner = false;
            console.log(error);
        })

    }
}