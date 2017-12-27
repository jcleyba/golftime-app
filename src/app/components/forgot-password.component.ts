/**
 * Created by juanleyba on 3/13/17.
 */
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../services/auth.service";
import {ReCaptchaService} from "../services/recaptcha.service";
import {ToastService} from "../services/toast.service";


@Component({
    selector: 'events-app',
    templateUrl: '../templates/forgot-password.component.html',
})
export class ForgotPasswordComponent {
    myForm: FormGroup;
    showSpinner: boolean = false;
    captchaCode: string = null;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private recaptcha: ReCaptchaService,
                private toast: ToastService) {
        window['captchaClicked'] = this.captchaClicked.bind(this);
        this.myForm = this.fb.group({
            email: ['', Validators.required]
        });
        this.loadScript();
    }

    loadScript() {
        let node = document.createElement('script');
        node.src = 'https://www.google.com/recaptcha/api.js';
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    captchaClicked(data: any) {
        this.captchaCode = data;
    }

    sendPasswordWithEmail() {
        let email = this.myForm.value.email;
        this.showSpinner = true;
        this.recaptcha.sendCaptcha({captcha: this.captchaCode}).then((response: any) => {
            if (JSON.parse(response._body).responseCode === 0) {
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
            else {
                this.showSpinner = false;
                this.toast.create({
                    show: true,
                    message: 'Por favor vuelva a intentar marcando correctamente el captcha.',
                    severity: 'error'
                })
            }

        });

    }
}