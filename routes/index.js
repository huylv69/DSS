var express = require('express');
var router = express.Router();
const connection = require('../db').connection;

// Storage 
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './storage');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});
var upload = multer({ storage: storage }).array('file', 1);
var uploadBangNganh = multer({ storage: storage }).array('bangnganh', 1);
var uploadBangDiem1 = multer({ storage: storage }).array('bangdiem1', 1);
var uploadBangDiem2 = multer({ storage: storage }).array('bangdiem2', 1);
var uploadBangPhoDiem = multer({ storage: storage }).array('bangphodiem', 1);
var uploadBangDiHoc = multer({ storage: storage }).array('bangdihoc', 1);
var uploadTest = multer({ storage: storage }).fields([
  { name: 'bangdiem1', maxCount: 1 },
  { name: 'bangnganh', maxCount: 1 },
  { name: 'bangdihoc', maxCount: 1 }]);


//Trang chu
router.get('/', function (req, res) {
  res.render('index', {msg: ""});
});

router.post('/uploadcsv', function (req, res) {

  uploadTest(req, res, function (err) {
    
    var bangnganh = req.files.bangnganh[0].path;
    var bangdihoc = req.files.bangdihoc[0].path;
    var bangdiem1 = req.files.bangdiem1[0].path;

    var delbangnganh = 'DELETE FROM bangnganh';
    var delbangdihoc = 'DELETE FROM dihoc';
    var delbangdiem1 = 'DELETE FROM bangdiem';
    connection.query(delbangnganh, function (err, result) {
      if (err)
        throw err;
    });

    connection.query(delbangdihoc, function (err, result) {
      if (err)
        throw err;
    });

    connection.query(delbangdiem1, function (err, result) {
      if (err)
        throw err;
    });

    var csv = require("fast-csv");
    var fs = require("fs");
    var stream = fs.createReadStream(bangnganh)
      .pipe(csv.parse({ headers: true }))
      .transform(function (row) {

        var sql = 'INSERT INTO bangnganh (ma_nganh, ten, chi_tieu) VALUES (' +
          "'" + row.ID + "'" +
          ',' + "'" + row.Ten + "'" +
          ',' + "'" + row.ChiTieu + "'" + ')';
        connection.query(sql, function (err, result) {
          if (err)
            throw err;
        });
      })
      .on("end", process.exit);


    var stream2 = fs.createReadStream(bangdiem1, { encoding: 'utf-8' })
      .pipe(csv.parse({ headers: true }))
      .transform(function (row) {
        var sql = 'INSERT INTO bangdiem (ID, Ten, Mon1, Mon2, Mon3, TongDiem, NV1, NV2 ) VALUES (' +
          "'" + row.ID + "'" +
          ',' + "'" + row.Ten + "'" +
          ',' + "'" + row.Mon1 + "'" +
          ',' + "'" + row.Mon2 + "'" +
          ',' + "'" + row.Mon3 + "'" +
          ',' + "'" + row.TongDiem + "'" +
          ',' + "'" + row.NV1 + "'" +
          ',' + "'" + row.NV2 + "'" + ')';
        connection.query(sql, function (err, result) {
          if (err)
            throw err;
        });
      })
      .on("end", process.exit);

    var stream3 = fs.createReadStream(bangdihoc)
      .pipe(csv.parse({ headers: true }))
      .transform(function (row) {
        var sql = 'INSERT INTO dihoc (diem, ty_Le ) VALUES (' + "'" + row.Diem + "'" +
          ',' + "'" + row.TyLe + "'" + ')';
        connection.query(sql, function (err, result) {
          if (err)
            throw err;
        });
      })
      .on("end", process.exit);
  })

  


 res.render('index', {msg: 'Tải lên thành công!'});
});

router.post('/process', function(req, res){

  //processing here
  //Demo biến kết quả
  var result = [{ten: "CNTT", diemchuan: "5"}, {ten: "TDH", diemchuan: "12"}];
  var pass = [{ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"},
                {ID: "2", Ten:"Linh", Mon1: "8", Mon2: "7", Mon3: "6", TongDiem: "21", Pass: "1"}];

                res.render('index2', {pass: pass, result: result});
});

router.get('/results', function (req, res) {

})
module.exports = router;
