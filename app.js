const express = require("express");
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const sprint = require('./setup/sprintInfo').sprint;
const ApiController = require(`./controllers/${sprint}/RestaurantController`);
const swaggerApiDocsPath = `/api-docs`
let app = express();

app.use(express.json());

let portNumber = require('./setup/portNumberInfo').portNumber;

console.log(`Current sprint : ${sprint}`);


app.use(function (req, res, next) {
    if(!req.url.startsWith(swaggerApiDocsPath)) {
        console.log(`New request received: ${req.method} ${req.url}`);
    }
    next();
});

//error handler
app.use(function (err, req, res, next) {
    console.log(err);
    let error = {
        errorMessage: err.bugDetails || err.message
    }
    res.status(err.statusCode || 500).send(error)
});

_configureSwagger();
_setupRouter();

app.listen(portNumber, () => {
    console.log("Server running on port " + portNumber);
});

function _configureSwagger() {
    const swaggerDocument = require(`./swagger/${sprint}/swagger.json`);
    const url = `http://localhost:${portNumber}${swaggerApiDocsPath}`;
    console.info('Setting up Swagger API docs at ', url);
    app.use(swaggerApiDocsPath, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

function _setupRouter() {
    //console.info('Setting up Auth middleware.');
    let router = express.Router();
    // Express can't process URL encoded forms, so, we use the body parser.
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/', router);
    _setupApiRoutes();
}

function _setupApiRoutes() {
    new ApiController(app);
}