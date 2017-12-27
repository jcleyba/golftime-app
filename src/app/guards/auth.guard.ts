/**
 * Created by juanleyba on 3/1/17.
 */
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../services/auth.service";
import {Router} from '@angular/router';

declare var firebase: any;

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        var currentUser = firebase.auth().currentUser;
        if (currentUser) {
            return this.authService.getUserById(currentUser.uid).then((user: any) => {
                if (user.val()['role'] === 1) {
                    return true;
                }
                else {
                    this.router.navigate(['/not-authorized']);
                    return false;
                }
            }).catch((error: any) => {
                console.log(error);
                this.router.navigate(['/not-authorized']);
                return false;
            })
        }
        else {
            this.router.navigate(['/not-authorized']);
            return false;
        }
    }
}