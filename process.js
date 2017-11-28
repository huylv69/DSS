var express = require('express');
const connection = require('./db').connection;


// create table synchronous
function doSynchronousTable(major, diemchuan, done) {
    let table = [];
    var loop = function (i, done) {
        let sql = 'select count(id) as cnt from bangdiem where NV1 = ' + major + ' and TongDiem >= ' + i;
        connection.query(sql, function (err, result) {
            var obj = {};
            obj.diem = i;
            obj.trung = result[0].cnt;
            table.push(obj);
            if ((i + 0.25) <= 30) {
                loop(i + 0.25, done);
            } else {
                done(table);
            }
        })
    };
    loop(diemchuan, done);

}

function doCountForMajor(major, diemchuan, done) {
    let list = [];
    var loop = function (i, done) {
        let sql = 'select count(id) as cnt from bangdiem where NV1 = ' + major + ' and TongDiem = ' + i;
        connection.query(sql, function (err, result) {
            var obj = {};
            obj.diem = i;
            obj.count = result[0].cnt;
            list.push(obj);
            if ((i + 0.25) <= 30) {
                loop(i + 0.25, done);
            } else {
                var sqlMajor = 'select  * from bangnganh where ma_nganh = ' + major;
                connection.query(sqlMajor, function (err, result) {
                    done(list, result[0]);
                })
            }
        })
    };
    loop(diemchuan, done);
}

// Lấy danh sách duyệt theo nguyện vọng 1
function doSynchronousNV1(data, diemchuan, done) {
    let listMajor = [];
    if (data.length > 0) {
        var loop = function (data, i, done) {
            element = data[i];
            let cntChiTieu = ' select count(id) as cnt from bangdiem where TongDiem >= ' + diemchuan + ' and Nv1 = ' + element.ma_nganh;
            connection.query(cntChiTieu, function (err, result) {
                if (err) throw err;
                let obj = { major: element.ma_nganh, denta: result[0].cnt - element.chi_tieu }
                listMajor.push(obj);
                if (++i < data.length) {
                    setTimeout(function () {
                        loop(data, i, done);
                    }, 0);
                } else {
                    done(listMajor, diemchuan);
                }
            });
        };
        loop(data, 0, done);
    } else {
        done(listMajor);
    }
}

// Tính điểm từng ngành data = list major 
function doSynchronousMajor(data, diemchuan, tyLeVuot, done) {
    let sql = 'select * from dihoc order by diem ASC';
    connection.query(sql, function (err, result) {
        var dihoc = new Array();
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            dihoc['d' + element.diem] = element.ty_le;
        }
        //console.log(dihoc['d20.5']);
        if (data.length > 0) {
            var loop = function (data, i, done) {

                doCountForMajor(1, diemchuan, function (listCnt, majorInfo) {
                    var table = new Array();
                    // console.log(listCnt);
                    // console.log(majorInfo);
                    var listCount = new Array();
                    for (let index = 0; index < listCnt.length; index++) {
                        const element = listCnt[index];
                        listCount['c' + element.diem] = element.count;
                    }
                    // console.log(listCount['c'+25]);
                    for (let index = diemchuan; index <= 30; index = (index + 0.25)) {
                        var obj = {};
                        obj.diem = index;
                        obj.trung = 0;
                        for (let i = index; i <= 30; i = (i + 0.25)) {
                            obj.trung = obj.trung + listCount['c' + i];
                        }
                        obj.dihoc = 0;
                        for (let i = index; i <= 30; i = (i + 0.25)) {
                            if (dihoc['d' + i]) {
                                obj.dihoc = obj.dihoc + (listCount['c' + i] * dihoc['d' + i]);
                            } else {
                                obj.dihoc = obj.dihoc + listCount['c' + i];
                            }
                        }
                        table.push(obj);
                    }
                    console.log(table.length);
                    table = table.filter((element) => {
                        return element.trung >= majorInfo.chi_tieu && element.dihoc < majorInfo.chi_tieu * (1 + tyLeVuot);
                    });
                    console.log(table);

                    if (++i < data.length) {
                        loop(data, i, done);
                    } else {
                        done();
                    }
                })

                // doSynchronousTable(2, diemchuan, function (tables) {
                //     console.log(tables);

                //     if (++i < data.length) {
                //         loop(data, i, done);
                //     } else {
                //         done();
                //     }
                // });
            };
            loop(data, 100, done);
        } else {
            done();
        }
    })

}
var process = function () {
    let diemchuan = 15;
    let tyLeVuot = 0.15;
    let sql = 'select * from bangnganh';
    connection.query(sql, function (err, result) {
        if (err)
            throw err;
        doSynchronousNV1(result, diemchuan, function (result) {
            result.sort(function (a, b) {
                return b.denta - a.denta;
            });

            // save candidate pass 
            // result.forEach(element => {
            //     if (element.denta < 0) {
            //         let insertTrue = ' insert into pass (ID, Ten, Mon1, Mon2, Mon3, TongDiem, Pass) select bangdiem.ID, bangdiem.Ten, bangdiem.Mon1, bangdiem.Mon2, bangdiem.Mon3, bangdiem.TongDiem, bangdiem.NV1 from bangdiem where TongDiem >= ' + diemchuan + ' and Nv1 = ' + element.major;
            //         connection.query(insertTrue, function (err, result) {
            //         });
            //     }
            // }, this);

            //thực hiện tính từng ngành 
            doSynchronousMajor(result, diemchuan, tyLeVuot, function (res) {

            });

        });

    });
}
process();
// doSynchronousMajor('huylv', function () {

// });