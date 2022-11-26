const config = require('config');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require("debug")('dev');
const app = express();
const contactRouter = require('./routes/contact_routes');
const mongoose = require("mongoose");
const Fawn = require("fawn");
const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const winston = require("winston")
const cors = require('cors');
const fs = require("fs")
const yaml = require('js-yaml')
const swaggerUi = require("swagger-ui-express");

try {
    const openApiSpecs = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(openApiSpecs));
} catch (e) {
    console.error(e);
}

const mongoUrl = "mongodb://localhost:27017"
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' })
    ],
  });
  
process.on('uncaughtException', (exception) => {
    debug(exception.message)
    logger.error(exception);
    // process.exit(1)
})
process.on('unhandledRejection', (exception) => {
    debug(exception.message)
    logger.error(exception)
    // process.exit(1)
})

mongoose.connect(mongoUrl)
    .then(onfulfilled => { debug("Connected to mongodb.") })
    .catch(onrejected => debug(onrejected))

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(helmet());
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/api/v1/contact', contactRouter);

app.listen(config.get('port'), () => {
    debug('Listening on port ' + config.get('port'));
});
