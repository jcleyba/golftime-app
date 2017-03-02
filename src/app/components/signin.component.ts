/**
 * Created by juanleyba on 3/1/17.
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {RouterModule, Router} from '@angular/router';


@Component({
    selector: 'sign-in-app',
    templateUrl: '../templates/signin.component.html',
    styleUrls: ['../signin.component.css']
})
export class SignInComponent implements OnInit {
    myForm: FormGroup;
    error = false;
    errorMessage = '';

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private router: Router) {
    }

    onSignin() {
        this.authService.signinUser(this.myForm.value).then((user: any) => {
            console.log(user);
            this.router.navigate(["torneos"])
        }).catch((error: any) => {
            console.log(error);
            alert(error.message);
        })
    }

    ngOnInit(): any {
        this.myForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
}
