/**
 * Created by juanleyba on 3/1/17.
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {RouterModule, Router} from '@angular/router';


@Component({
    selector: 'sign-in-app',
    templateUrl: '../templates/signin.component.html'
})
export class SignInComponent {
    myForm: FormGroup;
    error = false;
    errorMessage = '';
    showSpinner: boolean = false;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private router: Router) {
        this.myForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
        if (this.authService.isAuthenticated()) {
            this.router.navigate(["torneos"]);
        }
    }

    onSignin() {
        this.showSpinner = true;
        this.authService.signinUser(this.myForm.value).then((user: any) => {
            console.log(user);
            this.showSpinner = false;
            this.router.navigate(["torneos"]);
        }).catch((error: any) => {
            console.log(error);
            this.showSpinner = false;
            alert(error.message);
        })
    }
}
