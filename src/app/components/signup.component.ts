/**
 * Created by juanleyba on 3/1/17.
 */
/**
 * Created by juanleyba on 3/1/17.
 */
import '../../../public/css/styles.css';

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {ToastService} from "../services/toast.service";
import {Router} from '@angular/router';


@Component({
    selector: 'sign-up-app',
    templateUrl: '../templates/signup.component.html',
})
export class SignUpComponent {
    myForm: FormGroup;
    selectedClass = 0;
    showSpinner: boolean = false;
    classes = [
        {value: 0, display: 'A'},
        {value: 1, display: 'B'},
        {value: 2, display: 'C'},
        {value: 3, display: 'No Socio'}
    ];

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private toast: ToastService,
                private router: Router) {
        this.myForm = this.fb.group({
            email: ['', Validators.required],
            name: ['', Validators.required],
            phone: ['', Validators.required],
            class: [''],
            password: ['', Validators.required],
            confirm: ['', Validators.required],
        });
    }

    passwordMatch(password: string, confirm: string) {
        return password === confirm;
    }

    onSignup() {
        var userData = this.myForm.value;
        if (this.passwordMatch(userData.password, userData.confirm)) {
            this.showSpinner = true;
            this.authService.signupUser(userData).then((user: any) => {
                this.authService.registerUser(user.uid, this.myForm.value).then((snapshot: any) => {
                    this.showSpinner = false;
                    this.router.navigate(["torneos"]);
                }).catch((error: any) => {
                    console.log(error);
                    this.showSpinner = false;
                    this.toast.create({
                        show: true,
                        message: error.message,
                        severity: 'error'
                    })
                })
            }).catch((error: any) => {
                this.showSpinner = false;
                console.log(error);
                this.toast.create({
                    show: true,
                    message: error.message,
                    severity: 'error'
                })
            })
        }
        else {
            this.toast.create({
                show: true,
                message: "Sus contraseñas no coinciden, por favor vuelva a intentar",
                severity: 'warning'
            })
        }
    }
}
