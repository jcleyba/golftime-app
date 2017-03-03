/**
 * Created by juanleyba on 3/1/17.
 */
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../services/auth.service";
import {RouterModule, Router} from '@angular/router';


@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        return this.authService.getUser().then((snapshot: any) => {
            if (snapshot) {
                if (snapshot.val().role === 1) {
                    return true;
                }
                else {
                    this.router.navigate(['not-authorized'])
                }
            }
            console.log('not authenticated');
            this.router.navigate(['not-authorized']);
            return false;
        }).catch((error: any) => {
            console.log(error);
            this.router.navigate(['not-authorized']);
            return false;
        });
    }
}