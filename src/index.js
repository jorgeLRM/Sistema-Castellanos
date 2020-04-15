const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');

// INITIALIZATION
const app = express();

// SETTINGS
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// GLOBAL VARIABLES
app.use((req, res, next) => {

  next();
});

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/process',require('./routes/process'));

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// STARTING THE SERVER
app.listen(app.get('port'),() => {
  console.log('Server on port ' + app.get('port'));
});
