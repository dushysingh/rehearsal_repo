const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
const nodemailer = require('nodemailer');
const winston = require('./config/winston');
const routes = require('./routes');
const { ReE } = require('./services/util.service');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 8080;
const middleware = require('./middleware/userMiddleware');

const app = express();

app.use(morgan('dev'));
app.use(morgan('combined'));
app.use(morgan('combined', { stream: winston.stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
//Passport
app.use(passport.initialize());

//const auth = require('./auth/authJWT');

//app.use('/auth', auth);
app.use('/', routes); //middleware.checkToken,

// catch 404 and forward to error handler
app.use((req, res, next) => {
      next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // add this line to include winston logging
      //winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

      // render the error page
      res.status(err.status || 500);
      //res.render('error');
      ReE(res, err, 500);
});

process.on('unhandledRejection', error => {
      console.error('Uncaught Error', pe(error));
    });

// START THE SERVER
// ==============================================
app.listen(port, '0.0.0.0', (err) => {
      if (err) throw err;
      console.log(`Node app listening at port ${port}`);
});