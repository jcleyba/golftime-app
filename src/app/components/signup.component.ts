/**
 * Created by juanleyba on 3/1/17.
 */
/**
 * Created by juanleyba on 3/1/17.
 */

import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, User} from "../services/auth.service";
import {ToastService} from "../services/toast.service";
import {ReCaptchaService} from "../services/recaptcha.service";
import {Router, ActivatedRoute, Params} from '@angular/router';


@Component({
    selector: 'sign-up-app',
    templateUrl: '../templates/signup.component.html',
})
export class SignUpComponent {
    myForm: FormGroup;
    selectedClass = 0;
    userId: string;
    user: Object = new Object();
    showSpinner: boolean = false;
    classes = [
        {value: 0, display: 'A'},
        {value: 1, display: 'B'},
        {value: 2, display: 'C'},
        {value: 3, display: 'No Socio'}
    ];
    captchaCode: string = null;


    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private route: ActivatedRoute,
                private toast: ToastService,
                private recaptcha: ReCaptchaService,
                private router: Router) {
        window['captchaClicked'] = this.captchaClicked.bind(this);

        this.myForm = this.fb.group({
            email: ['', Validators.required],
            name: ['', Validators.required],
            phone: ['', Validators.required],
            class: [''],
            password: ['', Validators.required],
            matricula: ['', Validators.required],
            confirm: ['', Validators.required],
        });
        this.route.queryParams.subscribe((params: Params) => {
            var id = params['id'];
            if (id) {
                this.userId = id;
                this.preloadForm(id);
            }
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

    preloadForm(id: any) {
        this.showSpinner = true;
        this.authService.getUserById(id).then((user: any) => {
            this.user = user.val();
            this.selectedClass = this.user['class'];
            this.showSpinner = false;
        }).catch((error: any) => {
            console.log(error);
            this.showSpinner = false;
        })
    }

    passwordMatch(password: string, confirm: string) {
        return password === confirm;
    }

    onSignup() {
        var userData = this.myForm.value;
        this.recaptcha.sendCaptcha({captcha: this.captchaCode}).then((response: any) => {
            if (JSON.parse(response._body).responseCode === 0) {
                if (this.passwordMatch(userData.password, userData.confirm)) {
                    this.showSpinner = true;
                    if (this.user['id']) {
                        this.authService.updateCurrentUserEmail(userData.email).then((data: any) => {
                            this.updateUser(userData);
                        }).catch((error: any) => {
                            console.log(error);
                            this.showSpinner = false;
                        });
                    }
                    else {
                        this.sendNewUser(userData);
                    }
                }
                else {
                    this.toast.create({
                        show: true,
                        message: "Sus contraseñas no coinciden, por favor vuelva a intentar",
                        severity: 'warning'
                    })
                }

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

    updateUser(userData: any) {
        this.authService.updateCurrentUser(userData).then((response: any) => {
            this.showSpinner = false;
            this.router.navigate(["torneos"]);
        }).catch((error: any) => {
            console.log(error);
            this.showSpinner = false;
        })
    }

    sendNewUser(userData: any) {
        this.authService.signupUser(userData).then((user: any) => {
            this.authService.registerUser(user.uid, this.myForm.value).then((snapshot: any) => {
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
        });
    }
}
