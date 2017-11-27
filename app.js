var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//database
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '',
  password : '',
  database: "test",
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
    console.log('connected as id ' + connection.threadId);
});



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/assets", express.static(__dirname + "/public"));

app.get('/', function(req, res){
    connection.query("SELECT * FROM data", function (err, result) {
      if (err) throw err;
      res.render('index', {users: result});
    });
  
});

var bodyParser =	require("body-parser");
var multer	=	require('multer');
app.use(bodyParser.json());
var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
	  callback(null, './');
	},
	filename: function (req, file, callback) {
	  callback(null,Date.now() + '-' + file.originalname);
	}
  });
  var upload = multer({ storage : storage }).array('file',1);

  app.post('/uploadcsv',function(req,res){
	  upload(req,res,function(err) {
		  console.log(req.files);
      var datafile = req.files[0].filename;
      console.log(datafile);
            
      var csv = require("fast-csv");
      var fs = require("fs");
      // var path = require("path");

      var stream = fs.createReadStream( datafile)
      .pipe(csv.parse({headers: true}))

      .transform(function (row) {
          var country = row.Country.toString();
          var age = row.Age;
          var salary = row.Salary;
          var purchase = row.Purchased.toString();
          var sql = 'INSERT INTO data (country, age, salary, purchase) VALUES (' + "'" + country.toString()  + "'" + ','  + "'" +   age  + "'" + ',' +  "'" +  salary   + "'" + ',' +  "'" +  purchase.toString()  +  "'" + ')';
          console.log(sql);
          connection.query(sql, function (err, result) {
            if (err) 
              throw err;
            console.log("1 record inserted");
          });
      })
      .on("end", process.exit);
            
          });
      res.redirect('/');
  });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.listen(3000);








// var csv = require("fast-csv");
// var fs = require("fs");
// var path = require("path");

// var stream = fs.createReadStream(path.resolve("./", "Data.csv"))
// .pipe(csv.parse({headers: true}))

// .transform(function (row) {
//     var country = row.Country.toString();
//     var age = row.Age;
//     var salary = row.Salary;
//     var purchase = row.Purchased.toString();
//     var sql = 'INSERT INTO data (country, age, salary, purchase) VALUES (' + "'" + country.toString()  + "'" + ','  + "'" +   age  + "'" + ',' +  "'" +  salary   + "'" + ',' +  "'" +  purchase.toString()  +  "'" + ')';
//     console.log(sql);
//     connection.query(sql, function (err, result) {
//       if (err) 
//         throw err;
//       console.log("1 record inserted");
//     });
// })
// .on("end", process.exit);
