/**
 * Created by juanleyba on 3/1/17.
 */
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

export interface User {
    id: string;
    name: string;
    class: Number;
    phone: string;
    email: string;
    password: string;
    confirmPassword?: string;
}
declare var firebase: any;


@Injectable()
export class AuthService {
    constructor(private router: Router) {
    }

    signupUser(user: User) {
        return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
    }

    signinUser(user: User) {
        return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    }

    registerUser(id: string, user: User) {
        console.log(user);
        var users = firebase.database().ref("/users/" + id);
        return users.set({
            email: user.email,
            phone: user.phone,
            name: user.name,
            class: Number(user.class),
            role: 2
        })
    }

    logout() {
        return firebase.auth().signOut();
    }

    getUser() {
        var user = firebase.auth().currentUser;
        if (user) {
            return firebase.database().ref("/users/" + user.uid).once('value');
        }
        else {
            return firebase.database().ref("/users/" + "null").once('value');
        }
    }

    isAuthenticated() {
        var user = firebase.auth().currentUser;
        if (user) {
            return true;
        } else {
            return false;
        }
    }
}