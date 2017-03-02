/**
 * Created by juanleyba on 3/1/17.
 */
import {NgModule, Component}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {SignInComponent}from "./components/signin.component"
import {SignUpComponent}from "./components/signup.component"
import {CreateEventComponent}from "./components/create-event.component"
import {EventsComponent}from "./components/events.component"

@NgModule({
    imports: [
        RouterModule.forRoot([
            // Let's redirect it to default signin page
            {path: '', redirectTo: '/torneos', pathMatch: 'full'},
            {path: 'login', component: SignInComponent},
            {path: 'register', component: SignUpComponent},
            {path: 'torneos', component: EventsComponent},
            {path: 'crear-torneo', component: CreateEventComponent, canActivate: [AuthGuard]},
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [AuthGuard]
})

export class AppRoutingModule {
}