/**
 * Created by juanleyba on 4/11/17.
 */
var express = require('express');
var fs = require('fs');
var captchaCtrl = require('./controllers/captchaController');

var app = express();

app.use('/', express.static(__dirname + '/webapp/'));
app.get('/*', function (req, res) {
    fs.createReadStream(__dirname + '/webapp/index.html').pipe(res);
});

captchaCtrl(app);
app.listen(9000);