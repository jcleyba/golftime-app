/**
 * Created by juanleyba on 3/1/17.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {BrowserModule}  from '@angular/platform-browser';
import {SignInComponent} from './components/signin.component';
import {SignUpComponent} from './components/signup.component';
import {AppComponent} from './components/app.component';
import {EventsComponent} from './components/events.component';
import {SingleEventComponent} from './components/single-event.component';
import {CreateEventComponent} from './components/create-event.component';
import {HeaderComponent} from './components/header.component';
import {LogoComponent} from './components/logo.component';
import {SpinnerComponent} from './components/spinner.component';
import {ToastComponent} from './components/toast.component';
import {RestrictedAccessComponent} from './components/restricted-access.component';
import {ForgotPasswordComponent} from './components/forgot-password.component';
import {SearchPipe} from './pipes/search-pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppRoutingModule}from './app.routes'

import {AuthService} from "./services/auth.service";
import {EventsService} from "./services/events.service";
import {ToastService} from "./services/toast.service";
import {ReCaptchaService} from "./services/recaptcha.service";


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        HttpModule
    ],
    declarations: [
        AppComponent,
        SignInComponent,
        SignUpComponent,
        CreateEventComponent,
        EventsComponent,
        HeaderComponent,
        LogoComponent,
        SpinnerComponent,
        RestrictedAccessComponent,
        SingleEventComponent,
        ToastComponent,
        ForgotPasswordComponent,
        SearchPipe
    ],
    providers: [AuthService, EventsService, ToastService, ReCaptchaService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
