/**
 * Created by juanleyba on 4/11/17.
 */
var bodyParser = require('body-parser');
var request = require('request');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.post('/recaptcha', function (req, res) {
        var captcha = req.body['captcha'];
        console.log('captcha:' + captcha);
        if (captcha === undefined || captcha === '' || captcha === null) {
            return res.json({"responseCode": 1, "responseDesc": "Por favor seleccione el captcha."});
        }
        var secretKey = "6LfzdhwUAAAAANBtVr8-5Xf9OXUtNtXCjSc8IzDa";
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + captcha + "&remoteip=" + req.connection.remoteAddress;
        request(verificationUrl, function (error, response, body) {
            body = JSON.parse(body);
            if (body.success !== undefined && !body.success) {
                console.log('response:' + JSON.stringify(body));

                return res.json({"responseCode": 1, "responseDesc": "Failed captcha verification"});
            }
            console.log('response:' + JSON.stringify(body));
            res.json({"responseCode": 0, "responseDesc": "Success"});
        });
    });
};