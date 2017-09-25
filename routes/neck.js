/**
 * Created by janghunlee on 2017. 9. 22..
 */
module.exports = neck;

function neck(app , userModel , userNeckModel , neckModel , userAlarmModel){
    "use strict";

    app.post('/neck/updateUserNeck',(req,res)=>{
        var token = req.body.token;
        var userNeckSlope = req.body.userNeckSlope;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                var saveUserNeckModel = new userNeckModel({
                    "token":token,
                    "neckSlope":userNeckSlope
                });

                saveUserNeckModel.save((err,m)=>{
                    if(err) throw err;
                    res.send({
                        "status":200
                    });
                });
            }
            else{
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
        });
    });

    app.get('/neck/checkToday',(req,res)=>{
        var token = req.query.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                userAlarmModel.find({"token":token},(err,model)=>{
                    if(err) throw err;

                    if(model.length == 0){
                        res.send({
                            "status":404,
                            "message":"user neck data not found"
                        });
                    }
                    else{
                        var d = new Date();

                        var month = d.getMonth();
                        var date = d.getDate();

                        var hour = new Array();
                        var hourLength = new Array();
                        var returnArr = new Array();

                        var inputDate = month+":"+date;



                        for(var i = 0; i<24; i++){
                            hour[i] = 0;
                            returnArr[i] = "";
                            hourLength[i] = 0;
                        }

                        for(var i = 0; i<model.length; i++){
                            var check = model[i]["date"];

                            if(check == inputDate){
                                var inputHour = model[i]["time"] - 1;
                                var slope = model[i]["slope"];
                                hour[inputHour] += slope;
                                hourLength[i]++;
                            }

                        }


                        for(var i = 0; i<24; i++){
                            if(hour[i] == 0){
                                returnArr[i] = "none";
                            }
                            else{
                                var data = hour[i]/hourLength[i];
                                if(data > 2100){
                                    returnArr[i] = "정상"
                                }
                                else if(data >= 2050){
                                    returnArr[i] = "주의"
                                }
                                else if(data >= 2000){
                                    returnArr[i] = "경고"
                                }
                                else if(data >= 1900){
                                    returnArr[i] = "나쁨"
                                }
                                else if(data >= 1750){
                                    returnArr[i] = "매우 나쁨"
                                }

                            }
                        }

                    }

                    res.send({
                        "status":200,
                        "data":returnArr
                    });
                });
            }
        });
    });

    app.get('/neck/checkDay',(req,res)=>{
        var token = req.query.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                userAlarmModel.find({"token":token},(err,model)=>{
                    if(err) throw err;

                    if(model.length == 0){
                        res.send({
                            "status":404,
                            "message":"user neck data not found"
                        });
                    }
                    else{
                        var d = new Date();

                        var todayData = 0;
                        var yesterdayData = 0;
                        var yesteryesterdayData = 0;

                        var todayDataLength = 0;
                        var yesterdayDataLength = 0;
                        var yesteryesterdayDataLength = 0;

                        var date = d.getDate();
                        var month = d.getMonth();

                        var date1 = d.getMonth()+":"+d.getDate();
                        var date2 = "";
                        var date3 = "";

                        var return1 = "";
                        var return2 = "";
                        var return3 = "";

                        if(d.getDate() - 1 < 1){
                            if(month < 8){
                                if(month%2 == 1){
                                    var inputMonth = month - 1;
                                    var inputDate = 31;
                                }
                                else{
                                    var inputMonth = month - 1;
                                    var inputDate = 30;
                                }

                                date2 = inputMonth+":"+inputDate;
                            }
                            else{
                                if(month%2 == 1){
                                    var inputMonth = month - 1;
                                    var inputDate = 30;
                                }
                                else{
                                    var inputMonth = month - 1;
                                    var inputDate = 31;
                                }

                                date2 = inputMonth+":"+inputDate;
                            }
                        }

                        if(d.getDate() - 2 < 1){
                            if(month < 8){
                                if(month%2 == 1){
                                    var inputMonth = month - 1;
                                    var inputDate = 31;
                                }
                                else{
                                    var inputMonth = month - 1;
                                    var inputDate = 30;
                                }

                                date3 = inputMonth+":"+inputDate;
                            }
                            else{
                                if(month%2 == 1){
                                    var inputMonth = month - 1;
                                    var inputDate = 30;
                                }
                                else{
                                    var inputMonth = month - 1;
                                    var inputDate = 31;
                                }

                                date3 = inputMonth+":"+inputDate;
                            }
                        }


                        for(var i = 0; i<model.length; i++){
                            if(model[i]["date"] == date1){
                                todayData += model[i]["slope"];
                                todayDataLength++;
                            }
                            else if(model[i]["date"] == date2){
                                yesterdayData += model[i]["slope"];
                                yesterdayDataLength++;
                            }
                            else if(model[i]["date"] == date3){
                                yesteryesterdayData += model[i]["slope"];
                                yesteryesterdayDataLength++;
                            }
                        }

                        var resultToday = todayData/todayDataLength;
                        var resultYesterday = yesterdayData/yesterdayDataLength;
                        var resultYesterYesterday = yesteryesterdayData/yesteryesterdayDataLength;

                        if(resultToday > 2100){
                            return1 = "정상"
                        }
                        else if(resultToday >= 2050){
                            return1 = "주의"
                        }
                        else if(data >= 2000){
                            return1 = "경고"
                        }
                        else if(data >= 1900){
                            return1 = "나쁨"
                        }
                        else if(data >= 1750){
                            return1 = "매우 나쁨"
                        }
                        else{
                            return1 = "none"
                        }

                        if(resultYesterday > 2100){
                            return2 = "정상"
                        }
                        else if(resultYesterday >= 2050){
                            return2 = "주의"
                        }
                        else if(resultYesterday >= 2000){
                            return2 = "경고"
                        }
                        else if(resultYesterday >= 1900){
                            return2 = "나쁨"
                        }
                        else if(resultYesterday >= 1750){
                            return2 = "매우 나쁨"
                        }
                        else{
                            return2 = "none"
                        }


                        if(resultYesterYesterday > 2100){
                            return3 = "정상"
                        }
                        else if(resultYesterYesterday >= 2050){
                            return3 = "주의"
                        }
                        else if(resultYesterYesterday >= 2000){
                            return3 = "경고"
                        }
                        else if(resultYesterYesterday >= 1900){
                            return3 = "나쁨"
                        }
                        else if(resultYesterYesterday >= 1750){
                            return3 = "매우 나쁨"
                        }
                        else{
                            return3 = "none"
                        }

                    }

                    res.send({
                        "status":200,
                        "today":return1,
                        "yesterday":return2,
                        "doubleday":return3
                    });
                });
            }
        });
    });



    app.post("/neck/testNeckData",(req,res)=>{
        var neckSlope = req.body.neckSlope;

        var saveNeckModel = new neckModel({
            "neckSlope":neckSlope
        });

        saveNeckModel.save((err,model)=>{
            if(err) throw err;
            res.send({
                "status":200
            });
        });
    });
}