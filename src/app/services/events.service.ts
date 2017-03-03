/**
 * Created by juanleyba on 3/3/17.
 */
import {Injectable} from "@angular/core";

declare var firebase: any;


@Injectable()
export class EventsService {
    constructor() {
    }

    createEvent(event: any) {
        return firebase.database().ref("/events").push().set(event);
    }

    getEventsList() {
        return firebase.database().ref("/events").once('value');
    }

    getSingleEvent(id: any) {
        return firebase.database().ref("/events/" + id).once('value');
    }
}