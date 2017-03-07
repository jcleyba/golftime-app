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
    showSpinner: boolean = false;
    showToast: boolean = false;
    toastMessage: string;
    toastType: string;

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
            this.showSpinner = false;
            this.router.navigate(["torneos"]);
        }).catch((error: any) => {
            console.log(error);
            this.showSpinner = false;
            this.showToast = true;
            this.toastMessage = "Revise su usuario y contraseña";
            this.toastType = "error";
        })
    }
}
