/**
 * Created by juanleyba on 3/1/17.
 */
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../services/auth.service";

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        return this.authService.getUser().then((snapshot: any) => {
            if (snapshot) {
                return snapshot.val().role === 1;
            }
            console.log('not authenticated');
            return false;
        });
    }
}