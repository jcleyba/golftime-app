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
    role: Number;
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
        var users = firebase.database().ref("/users/" + id);
        return users.set({
            id: id,
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

    getUserById(id: any) {
        return firebase.database().ref("/users/" + id).once('value');
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

    updateCurrentUser(userData: any) {
        var key = firebase.auth().currentUser.uid;
        return firebase.database().ref("/users/" + key).set({
            id: key,
            email: userData.email,
            phone: userData.phone,
            name: userData.name,
            class: Number(userData.class),
            role: 2
        })
    }

    updateCurrentUserEmail(email: any) {
        return firebase.auth().currentUser.updateEmail(email);
    }

    isAuthenticated() {
        var user = firebase.auth().currentUser;
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    recoverPassword(email: any) {
        return firebase.auth().sendPasswordResetEmail(email)
    }
}