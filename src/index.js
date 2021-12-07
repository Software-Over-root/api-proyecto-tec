const express = require('express');
const routers = require('./routers');
const bodyParser = require('body-parser');

const app = express();


app.set('port', process.env.PORT || 5000 );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

//configuracion de los cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});
//fin de los cors

app.use('/', routers());

app.listen(app.get('port'), () => {
    console.log('server on port ', app.get('port'));
});
