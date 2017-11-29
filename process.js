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
//get information major
function getInfoMajor(major, done) {
    var sqlMajor = 'select  * from bangnganh where ma_nganh = ' + major;
    connection.query(sqlMajor, function (err, result) {
        done(result[0]);
    })
}
// dem 2 nguyen vong
function doCountMajor2NV(major, diemchuan, daduyet, done) {
    // major =3;
    // index =16;
    // daduyet =[4,7];
    let list = [];
    var loop = function (i, done) {
        let sql;
        if (daduyet.length > 0) {
            sql = 'select count(id) as cnt from bangdiem where TongDiem = ' + i + ' and ( NV1 = ' + major + ' or (NV2 = ' + major + ' and NV1 not in (' + daduyet + ')))';
        }
        else sql = 'select count(id) as cnt from bangdiem where TongDiem = ' + i + ' and ( NV1 = ' + major + ' or NV2 = ' + major + ')';
        connection.query(sql, function (err, result) {
            var obj = {};
            obj.diem = i;
            obj.count = result[0].cnt;
            list.push(obj);
            if ((i + 0.25) <= 30) {
                loop(i + 0.25, done);
            } else {
                done(list);
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
            console.log(sql);
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
                console.log(cntChiTieu);
                if (err) throw err;
                let obj = { major: element.ma_nganh, denta: result[0].cnt - element.chi_tieu }
                if (obj.denta <= 0) obj.nv1 = result[0].cnt;
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
    connection.query(sql, function (err, resultDiHoc) {
        var ketqua = [];
        var daduyet = [];
        var dihoc = new Array();
        for (let i = 0; i < resultDiHoc.length; i++) {
            const element = resultDiHoc[i];
            dihoc['d' + element.diem] = element.ty_le;
        }
        //console.log(dihoc['d20.5']);
        if (data.length > 0) {
            var loop = function (data, i, done) {
                if (data[i].denta > 0) {
                    doCountForMajor(data[i].major, diemchuan, function (listCnt, majorInfo) {
                        var table = new Array();
                        // List dem tung thang diem
                        var listCount = new Array();
                        for (let index = 0; index < listCnt.length; index++) {
                            const element = listCnt[index];
                            listCount['c' + element.diem] = element.count;
                        }
                        console.log(listCount);
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

                        // Loc tu chi tieu va ty le vuot 
                        table = table.filter((element) => {
                            return element.trung >= majorInfo.chi_tieu && element.dihoc < majorInfo.chi_tieu * (1 + tyLeVuot);
                        });
                        console.log(table);

                        //chuẩn hóa :          
                        // let good = JSON.parse(JSON.stringify(table[0]));
                        // let bad = JSON.parse(JSON.stringify(table[table.length - 1]));
                        let choose = [];
                        for (let i = 0; i < table.length; i++) {
                            const element = table[i];
                            let obj = {};
                            obj.diem = element.diem;
                            obj.denta = element.trung - element.dihoc;
                            choose.push(obj);
                        }
                        choose.sort(function (a, b) {
                            return parseFloat(a.denta) - parseFloat(b.denta);
                        });
                        let chose = choose[0];
                        let listResult = choose.filter(e => {
                            return e.denta == chose.denta;
                        });
                        console.log(listResult);
                        //TS
                        //Khoang cach 
                        // good = JSON.parse(JSON.stringify(table[0]));
                        // bad = JSON.parse(JSON.stringify(table[table.length - 1]));
                        // let sPlus = [];
                        // let sSub = [];
                        let result = Math.max.apply(Math, listResult.map(function (o) { return o.diem; }));
                        console.log(result);
                        let objRe = {};
                        objRe.nganh = majorInfo.ten;
                        objRe.ma_nganh = majorInfo.ma_nganh;
                        objRe.diemchuan = result;
                        ketqua.push(objRe);
                        let insertTrue = ' insert into pass (ID, Ten, Mon1, Mon2, Mon3, TongDiem, Pass) select bangdiem.ID, bangdiem.Ten, bangdiem.Mon1, bangdiem.Mon2, bangdiem.Mon3, bangdiem.TongDiem, bangdiem.NV1 from bangdiem where TongDiem >= ' + result + ' and Nv1 = ' + majorInfo.ma_nganh;
                        connection.query(insertTrue, function (err, result) {
                            daduyet.push(data[i].major);
                            if (err) throw err;
                            if (++i < data.length) {
                                loop(data, i, done);
                            } else {
                                done(ketqua);
                            }
                        });
                    })
                } else {
                    getInfoMajor(data[i].major, function (infoMajor) {
                        //console.log(infoMajor);
                        var chiTieuMoi = Math.ceil(infoMajor.chi_tieu * (1 + tyLeVuot));
                        doCountMajor2NV(data[i].major, diemchuan, daduyet, function (listCnt) {
                            console.log(listCnt);
                            var table = new Array();
                            // List dem tung thang diem
                            var listCount = new Array();
                            for (let index = 0; index < listCnt.length; index++) {
                                const element = listCnt[index];
                                listCount['c' + element.diem] = element.count;
                            }
                            // console.log(listCount['c'+25]);
                            //Tinh trung tuyen va thuc te di hoc
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
                            console.log(table);
                            if (table[0].trung < infoMajor.chi_tieu) {
                                let result = table[0].diem;
                                let listResult = table.filter(e => {
                                    return e.diem == result;
                                });
                                console.log(listResult);
                                result = Math.max.apply(Math, listResult.map(function (o) { return o.diem; }));
                                console.log(result);
                                let objRe = {};
                                objRe.nganh = infoMajor.ten;
                                objRe.ma_nganh = infoMajor.ma_nganh;
                                objRe.diemchuan = result;
                                ketqua.push(objRe);
                                let insertTrue = ' insert into pass (ID, Ten, Mon1, Mon2, Mon3, TongDiem, Pass) select bangdiem.ID, bangdiem.Ten, bangdiem.Mon1, bangdiem.Mon2, bangdiem.Mon3, bangdiem.TongDiem, bangdiem.NV1 from bangdiem where TongDiem >= ' + result + ' and Nv1 = ' + infoMajor.ma_nganh;
                                connection.query(insertTrue, function (err, res) {
                                    let sql2 = ' insert into pass (ID, Ten, Mon1, Mon2, Mon3, TongDiem, Pass) select bangdiem.ID, bangdiem.Ten, bangdiem.Mon1, bangdiem.Mon2, bangdiem.Mon3, bangdiem.TongDiem, bangdiem.NV1 from bangdiem where TongDiem >= ' + result + ' and (Nv2 = ' + infoMajor.ma_nganh + ' and NV1 not in (' + daduyet + '))';
                                    console.log(sql2);
                                    connection.query(sql2, function (err, res) {
                                        daduyet.push(data[i].major);
                                        if (err) throw err;
                                        if (++i < data.length) {
                                            loop(data, i, done);
                                        } else {
                                            done(ketqua);
                                        }
                                    })
                                });
                            } else {
                                // Loc tu chi tieu va ty le vuot 
                                table = table.filter((element) => {
                                    return (element.trung >= infoMajor.chi_tieu) && (element.dihoc < infoMajor.chi_tieu * (1 + tyLeVuot));
                                });
                                console.log(table);
                                // bang chon 
                                let choose = [];
                                for (let i = 0; i < table.length; i++) {
                                    const element = table[i];
                                    let obj = {};
                                    obj.diem = element.diem;
                                    obj.denta = element.trung - element.dihoc;
                                    choose.push(obj);
                                }
                                console.log(choose);
                                //sap xep
                                choose.sort(function (a, b) {
                                    return parseFloat(a.denta) - parseFloat(b.denta);
                                });
                                console.log(choose);
                                let chose = choose[0];
                                let listResult = choose.filter(e => {
                                    return e.denta == chose.denta;
                                });
                                console.log(listResult);

                                let result = Math.max.apply(Math, listResult.map(function (o) { return o.diem; }));
                                console.log(result);
                                let objRe = {};
                                objRe.nganh = infoMajor.ten;
                                objRe.ma_nganh = infoMajor.ma_nganh;
                                objRe.diemchuan = result;
                                ketqua.push(objRe);
                                let insertTrue = ' insert into pass (ID, Ten, Mon1, Mon2, Mon3, TongDiem, Pass) select bangdiem.ID, bangdiem.Ten, bangdiem.Mon1, bangdiem.Mon2, bangdiem.Mon3, bangdiem.TongDiem, bangdiem.NV1 from bangdiem where TongDiem >= ' + result + ' and NV1 = ' + infoMajor.ma_nganh;
                                connection.query(insertTrue, function (err, res) {
                                    let sql2 = ' insert into pass (ID, Ten, Mon1, Mon2, Mon3, TongDiem, Pass) select bangdiem.ID, bangdiem.Ten, bangdiem.Mon1, bangdiem.Mon2, bangdiem.Mon3, bangdiem.TongDiem, bangdiem.NV1 from bangdiem where TongDiem >= ' + result + ' and ( NV2 = ' + infoMajor.ma_nganh + ' and NV1 not in (' + daduyet + '))';
                                    // if (daduyet.length > 0) {
                                    //     sql2 = 'select count(id) as cnt from bangdiem where TongDiem = ' + i + ' and ( NV1 = ' + major + ' or (NV2 = ' + major + ' and NV1 not in (' + daduyet + ')))';
                                    // }
                                    // else sql2 = 'select count(id) as cnt from bangdiem where TongDiem = ' + i + ' and ( NV1 = ' + major + ' or NV2 = ' + major + ')';
                                    console.log(sql2);
                                    connection.query(sql2, function (err, res) {
                                        daduyet.push(data[i].major);
                                        if (err) throw err;
                                        if (++i < data.length) {
                                            loop(data, i, done);
                                        } else {
                                            done(ketqua);
                                        }
                                    })
                                });
                            }
                        })
                    })
                }
            };
            loop(data, 0, done);
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
            console.log(result);
            doSynchronousMajor(result, diemchuan, tyLeVuot, function (res) {

            });

        });

    });
}
process();
// doSynchronousMajor('huylv', function () {

// });