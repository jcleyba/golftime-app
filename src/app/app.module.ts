/**
 * Created by juanleyba on 3/1/17.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule}  from '@angular/platform-browser';
import {SignInComponent} from './components/signin.component';
import {SignUpComponent} from './components/signup.component';
import {AppComponent} from './components/app.component';
import {EventsComponent} from './components/events.component';
import {SingleEventComponent} from './components/single-event.component';
import {CreateEventComponent} from './components/create-event.component';
import {HeaderComponent} from './components/header.component';
import {SpinnerComponent} from './components/spinner.component';
import {ToastComponent} from './components/toast.component';
import {RestrictedAccessComponent} from './components/restricted-access.component';
import {ForgotPasswordComponent} from './components/forgot-password.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppRoutingModule}from './app.routes'

import {AuthService} from "./services/auth.service";
import {EventsService} from "./services/events.service";
import {ToastService} from "./services/toast.service";


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        SignInComponent,
        SignUpComponent,
        CreateEventComponent,
        EventsComponent,
        HeaderComponent,
        SpinnerComponent,
        RestrictedAccessComponent,
        SingleEventComponent,
        ToastComponent,
        ForgotPasswordComponent
    ],
    providers: [AuthService, EventsService, ToastService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
