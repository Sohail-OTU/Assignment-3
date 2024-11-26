let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
require('dotenv').config();

let app = express();
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let groceryRouter = require('../routes/grocery');
let authRouter = require('../routes/auth');


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
// getting-started.js
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit process if connection fails
  });
  
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error'));
mongoDB.once('open',()=>{
  console.log("Connected with the MongoDB")
});
/* main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/GroceryLib');
  //await mongoose.connect('mongodb+srv://ahmedsheikh:Test123@cluster0.0f3pz.mongodb.net/');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/grocerylist',groceryRouter);
app.use('/', authRouter);
console.log('Auth routes mounted at root');
// /project --> projectrouter
// /contactus --> contactus

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error'});
});

module.exports = app;
