/**
 * Created by juanleyba on 3/13/17.
 */
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, User} from "../services/auth.service";
import {ToastService} from "../services/toast.service";
import {Router} from '@angular/router';


@Component({
    selector: 'events-app',
    templateUrl: '../templates/forgot-password.component.html',
})
export class ForgotPasswordComponent {
    myForm: FormGroup;
    showSpinner: boolean = false;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private toast: ToastService) {
        this.myForm = this.fb.group({
            email: ['', Validators.required]
        });
    }

    sendPasswordWithEmail() {
        let email = this.myForm.value.email;
        this.showSpinner = true;
        this.authService.recoverPassword(email).then((response: any) => {
            this.showSpinner = false;
            this.toast.create({
                show: true,
                message: 'Revise su email para reestablecer su contraseña.',
                severity: 'alert'
            });
            this.myForm.reset();
        }).catch((error: any) => {
            this.showSpinner = false;
            this.toast.create({
                show: true,
                message: error.message,
                severity: 'error'
            })
        });
    }
}