/**
 * Created by juanleyba on 4/13/17.
 */
'use strict';
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var moment = require('moment');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.post('/sendEventTimeEmail', function (req, res) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'teeoffgolf@gmail.com',
                pass: '31357915'
            }
        });
        console.log(req.body);
        moment.locale('es');
        var timeString = moment(req.body.time).format("dddd DD MMM YYYY").toString();
        var hourString = moment(req.body.time).format("hh:mm a").toString();
        var message = '<b>¡Usted está inscripto!</b><br><p>Torneo: ' + req.body.title + '</p><p>Fecha: ' + timeString + '</p><p>Hora: ' + hourString + '</p><p>¡Adelante y suerte!</p><b>Equipo de Golftime</b>'
        var mailOptions = {
            from: '"Golftime - Inscripción" <teeoffgolf@gmail.com>',
            to: req.body.email,
            subject: 'Su inscripción ✔',
            html: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.json({data: 'email sent'});
        });
    });
};


