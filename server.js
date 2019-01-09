const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const host = process.env.HOST || '127.0.0.1';
global.session = require('express-session');

// SESSION
app.set('trust proxy', 1) // trust first proxy
app.use(global.session({
    secret: 'parque estacionamento',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Conectar a base de dados
require('./assets/connect');

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

const router = require('./routes/parque.route');
app.use(router);

const Auth = require('./routes/autentication.route');
app.use(Auth);

const admin = require('./routes/admin.route');
app.use(admin);

const arduino = require('./routes/arduino.route');
app.use(arduino);

const cors = require('cors');

const expressSanitizer = require('express-sanitizer');
const expressValidator = require('express-validator');


app.use(expressSanitizer());
app.use(expressValidator());

//forçar utilização das bibliotecas
app.use(cors());
//module.exports = app;


app.listen(port, function(err) {
    if (!err) {
        console.log('Your app is listening on ' + host + ' and port ' + port);
    }
    else {
        console.log(err);
    }
});

// consumerKey: '937373939935-m1ljsq1ok8n1hlipvujb4d2jav416f5b.apps.googleusercontent.com',
//     consumerSecret: '7vxQFng-NXWrZdDuB_akc2pI',
