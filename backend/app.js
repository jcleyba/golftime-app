/**
 * Created by juanleyba on 4/11/17.
 */
var express = require('express');
var favicon = require('serve-favicon');
var fs = require('fs');
var captchaCtrl = require('./controllers/captchaController');
var emailCtrl = require ('./controllers/mailController');
var app = express();

app.use(favicon(__dirname + '/webapp/assets/favicon.png'));

app.use('/', express.static(__dirname + '/webapp/'));
app.get('/*', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(__dirname + '/webapp/index.html').pipe(res);
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 9000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

captchaCtrl(app);
emailCtrl(app);
app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
});