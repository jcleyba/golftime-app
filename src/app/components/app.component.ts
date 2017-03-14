/**
 * Created by juanleyba on 3/1/17.
 */
import {Component} from '@angular/core';

const styles = require('../../../public/css/style.less');

@Component({
    selector: 'my-app',
    templateUrl: '../templates/app.component.html',
    styles: [styles.toString()]
})
export class AppComponent {
}