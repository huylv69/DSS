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
  user     : 'root',
  password : '',
  database: "dss",
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

//Trang chu
app.get('/', function(req, res){
    connection.query("SELECT * FROM data", function (err, result) {
      if (err) throw err;
      res.render('index', {users: result});
    });
});

//Trang NV1
app.get('/nv1', function(req, res){
  connection.query("SELECT * FROM nv1", function (err, result) {
    if (err) throw err;
    res.render('nv1', {users: result});
  });
});

//Trang NV2
app.get('/nv2', function(req, res){
  connection.query("SELECT * FROM nv2", function (err, result) {
    if (err) throw err;
    res.render('nv2', {users: result});
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
  var uploadBangNganh = multer({ storage : storage }).array('bangnganh',1);
  var uploadBangDiem1 = multer({ storage : storage }).array('bangdiem1',1);
  var uploadBangDiem2 = multer({ storage : storage }).array('bangdiem2',1);
  var uploadBangPhoDiem = multer({ storage : storage }).array('bangphodiem',1);
  var uploadBangDiHoc = multer({ storage : storage }).array('bangdihoc',1);
  

  app.post('/uploadcsv',function(req,res){
    
	  uploadBangNganh(req,res,function(err) {
      var csv = require("fast-csv");
      var fs = require("fs");
      var datafile = req.files[0].filename;
      var stream = fs.createReadStream( datafile)
      .pipe(csv.parse({headers: true}))
      .transform(function (row) {
          var sql = 'INSERT INTO bangnganh (ID, Ten, Chitieu, DiemSan) VALUES (' + "'" + row.ID + "'" + 
          ','  + "'" +   row.Ten  + "'" +
           ',' +  "'" +  row.ChiTieu   + "'" + 
           ',' +  "'" +  row.DiemSan  +  "'" + ')';
          connection.query(sql, function (err, result) {
            if (err) 
              throw err;
          });
      })
      .on("end", process.exit);
      });

      

        // uploadBangDiem2(req,res,function(err) {
        //   var datafile = req.files[0].filename;
        //   var stream = fs.createReadStream( datafile)
        //   .pipe(csv.parse({headers: true}))
        //   .transform(function (row) {
        //       var sql = 'INSERT INTO bangdiem2 (ID, Ten, Mon1, Mon2, Mon3, TongDiem, NV2 ) VALUES (' + "'" + row.ID + "'" + 
        //       ','  + "'" +   row.Ten  + "'" +
        //        ',' +  "'" +  row.Mon1   + "'" +
        //        ',' +  "'" +  row.Mon2   + "'" + 
        //        ',' +  "'" +  row.Mon3   + "'" + 
        //        ',' +  "'" +  row.TongDiem   + "'" + 
        //        ',' +  "'" +  row.NV2  +  "'" + ')';
        //       connection.query(sql, function (err, result) {
        //         if (err) 
        //           throw err;
        //       });
        //   })
        //   .on("end", process.exit);
        //   });

          // uploadBangPhoDiem(req,res,function(err) {
          //   var datafile = req.files[0].filename;
          //   var stream = fs.createReadStream( datafile)
          //   .pipe(csv.parse({headers: true}))
          //   .transform(function (row) {
          //       var sql = 'INSERT INTO bangphodiem (d1, d2, d3, d4, d5, d6, d7, d8, d9, d10 ) VALUES (' + "'" + row.d1 + "'" + 
          //       ','  + "'" +   row.d2  + "'" +
          //        ',' +  "'" +  row.d3   + "'" +
          //        ',' +  "'" +  row.d4   + "'" + 
          //        ',' +  "'" +  row.d5   + "'" + 
          //        ',' +  "'" +  row.d6   + "'" + 
          //        ',' +  "'" +  row.d7   + "'" + 
          //        ',' +  "'" +  row.d8   + "'" + 
          //        ',' +  "'" +  row.d9   + "'" + 
          //        ',' +  "'" +  row.d10  +  "'" + ')';
          //       connection.query(sql, function (err, result) {
          //         if (err) 
          //           throw err;
          //       });
          //   })
          //   .on("end", process.exit);
          //   });


           
  



      res.redirect('/');
  });


  app.post('/bangdiem1', function(req, res){
    uploadBangDiem1(req,res,function(err) {
          var csv = require("fast-csv");
          var fs = require("fs");
          var datafile = req.files[0].filename;
          var stream = fs.createReadStream(datafile, {encoding: 'utf-8'})
          .pipe(csv.parse({headers: true}))
          .transform(function (row) {
              var sql = 'INSERT INTO bangdiem1 (ID, Ten, Mon1, Mon2, Mon3, TongDiem, NV1 ) VALUES (' + "'" + row.ID + "'" + 
              ','  + "'" +   row.Ten  + "'" +
              ',' +  "'" +  row.Mon1   + "'" +
              ',' +  "'" +  row.Mon2   + "'" + 
              ',' +  "'" +  row.Mon3   + "'" + 
              ',' +  "'" +  row.TongDiem   + "'" + 
              ',' +  "'" +  row.NV1  +  "'" + ')';
              connection.query(sql, function (err, result) {
                if (err) 
                  throw err;
              });
          })
          .on("end", process.exit);
        });
        res.redirect('/');
  })

  app.post('/bangdihoc', function(req, res){
     uploadBangDiHoc(req,res,function(err) {
              var csv = require("fast-csv");
              var fs = require("fs");
              var datafile = req.files[0].filename;
              var stream = fs.createReadStream( datafile)
              .pipe(csv.parse({headers: true}))
              .transform(function (row) {
                  var sql = 'INSERT INTO bangdihoc (Diem, TyLe ) VALUES (' + "'" + row.Diem + "'" + 
                   ',' +  "'" +  row.TyLe  +  "'" + ')';
                  connection.query(sql, function (err, result) {
                    if (err) 
                      throw err;
                  });
              })
              .on("end", process.exit);
              });
              res.redirect('/');
  })
  
  //Upload Thi Sinh NV1
  app.post('/nv1',function(req,res){
	  upload(req,res,function(err) {
		  console.log(req.files);
      var datafile = req.files[0].filename;
      var csv = require("fast-csv");
      var fs = require("fs");
      var stream = fs.createReadStream( datafile, {encoding:"utf-8"})
      .pipe(csv.parse({headers: true}))

      .transform(function (row) {
         
          var sql = 'INSERT INTO nv1 (ID, Name ,Toan , Ly, Hoa, Van, Anh, Sinh, Su, Dia, NV1) VALUES (' 
          + "'" + row.ID  + "'" + ','  
          + "'" +   row.Name  + "'" + ',' 
          +  "'" +  row.Toan   + "'" + ',' 
          +  "'" +  row.Ly   + "'" + ','
          +  "'" +  row.Hoa   + "'" + ',' 
          +  "'" +  row.Van   + "'" + ',' 
          +  "'" +  row.Anh   + "'" + ',' 
          +  "'" +  row.Sinh   + "'" + ',' 
          +  "'" +  row.Su   + "'" + ','  
          +  "'" +  row.Dia   + "'" + ','  
          +  "'" +  row.NV1  +  "'" + ')';
          connection.query(sql, function (err, result) {
            if (err) 
              throw err;
          });
      })
      .on("end", process.exit);
            
          });
      res.redirect('/nv1');
  });

   //Upload Thi Sinh NV2
   app.post('/nv2',function(req,res){
	  upload(req,res,function(err) {
		  console.log(req.files);
      var datafile = req.files[0].filename;
      var csv = require("fast-csv");
      var fs = require("fs");
      var stream = fs.createReadStream( datafile, {encoding:"utf-8"})
      .pipe(csv.parse({headers: true}))

      .transform(function (row) {
         
          var sql = 'INSERT INTO nv2 (ID, Name ,Toan , Ly, Hoa, Van, Anh, Sinh, Su, Dia, NV2) VALUES (' 
          + "'" + row.ID  + "'" + ','  
          + "'" +   row.Name  + "'" + ',' 
          +  "'" +  row.Toan   + "'" + ',' 
          +  "'" +  row.Ly   + "'" + ','
          +  "'" +  row.Hoa   + "'" + ',' 
          +  "'" +  row.Van   + "'" + ',' 
          +  "'" +  row.Anh   + "'" + ',' 
          +  "'" +  row.Sinh   + "'" + ',' 
          +  "'" +  row.Su   + "'" + ','  
          +  "'" +  row.Dia   + "'" + ','  
          +  "'" +  row.NV2  +  "'" + ')';
          connection.query(sql, function (err, result) {
            if (err) 
              throw err;
          });
      })
      .on("end", process.exit);
            
          });
      res.redirect('/nv2');
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