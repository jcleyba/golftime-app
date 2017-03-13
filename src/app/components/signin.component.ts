/**
 * Created by juanleyba on 3/1/17.
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ToastService} from "../services/toast.service";
import {RouterModule, Router} from '@angular/router';


@Component({
    selector: 'sign-in-app',
    templateUrl: '../templates/signin.component.html'
})
export class SignInComponent {
    myForm: FormGroup;
    showSpinner: boolean = false;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private toast: ToastService) {
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
            this.toast.create({
                show: true,
                message: "Verifique su usuario y contraseña",
                severity: 'error'
            });
            this.showSpinner = false;
        })
    }
}
