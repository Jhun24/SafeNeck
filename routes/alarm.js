/**
 * Created by janghunlee on 2017. 9. 8..
 */
module.exports = alarm;

function alarm(app,alarmModel,userModel,settingModel,userAlarmModel){
    "use strict";
    app.get('/alarm/add/daily',(req,res)=>{
        var token = req.query.token;

        var alarmModelData = new Array();
        alarmModelData[0] = new Array();


        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                console.log(model);
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                alarmModel.find({"token":token},(err,m)=>{
                    if(err) throw err;

                    if(m.length == 0){
                        var saveAlarmModel = new alarmModel({
                            token:token,
                            todayAlarm:1,
                            monthAlarm:1,
                            weekAlarm:1
                        });

                        saveAlarmModel.save((err,mo)=>{
                            if(err) throw err;
                            alarmModelData = m[0];
                        });
                    }
                    else{
                        var dailyAdd = m[0]["todayAlarm"] + 1;
                        var monthAdd = m[0]["monthAlarm"] + 1;
                        var weekAdd = m[0]["weekAlarm"] + 1;

                        alarmModel.update({"token":token},{$set:{"todayAlarm":dailyAdd,"monthAlarm":monthAdd,"weekAlarm":weekAdd}},(err,mo)=>{
                            if(err) throw err;
                            alarmModelData = m[0];
                        });
                    }

                    res.send({
                        "status":200,
                        "data":alarmModelData
                    });
                });
            }
        });
    });

    app.get('/alarm/saveUserNeck',(req,res)=>{
        var token = req.query.token;

        var middleSlope = req.query.middleSlope;
        var leftSlope = req.query.leftSlope;
        var rightSlope = req.query.rightSlope;

        userAlarmModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            var d = new Date();

            var month = d.getMonth();
            var date = d.getDate();

            var hour = d.getHours();

            var saveDate = month+":"+date;

            var saveUserAlarmModel = new userAlarmModel({
                "token":token,
                "date":saveDate,
                "middleSlope":middleSlope,
                "leftSlope":leftSlope,
                "rightSlope":rightSlope,
                "time":hour
            });

            saveUserAlarmModel.save((err,mo)=>{
                if(err) throw err;


                res.send({
                    "status":200,
                    "data":model
                });
            });
        });
    });

    app.get('/alarm/getData',(req,res)=>{
        var token = req.query.token;

        alarmModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"data not found"
                });
            }
            else{
                res.send({
                    "status":200,
                    "data":model
                });
            }
        });
    });

    app.post('/alarm/checkDailyAward',(req,res)=>{
        var token = req.body.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                settingModel.find({"token":token},(err,m)=>{
                    if(err) throw err;

                    if(m.length == 0){
                        res.send({
                            "status":404,
                            "message":"please initialize your setting"
                        });
                    }
                    else{
                        alarmModel.find({"token":token},(err,mo)=>{
                            if(err) throw err;

                            if(mo.length == 0){
                                res.send({
                                    "status":404,
                                    "message":"no data for user neck"
                                });
                            }
                            else{
                                var userAlarm = mo[0]["todayAlarm"];
                                var userAward = m[0]["dailyAward"];

                                if(userAlarm > userAward){
                                    res.send({
                                        "status":200,
                                        "result":true
                                    });

                                    // 넘김
                                }
                                else{
                                    res.send({
                                        "status":200,
                                        "result":false
                                    });

                                    // 안넘김
                                }

                            }
                        });
                    }
                });
            }
        });
    });
    
    app.get('/alarm/circleGraph',(req,res)=>{
        var token = req.query.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":200,
                    "message":"user not found"
                });
            }
            else{
                userAlarmModel.find({"token":token},(err,model)=>{
                    if(err) throw err;

                    if(model.length == 0){
                        res.send({
                            "status":404,
                            "message":"no data in user neck data"
                        });
                    }
                    else{
                        var d = new Date();
                        var day = d.getDay();
                        var date = d.getDate();
                        var month = d.getMonth();


                        var todayArr = new Array();

                        todayArr["정상"] = 0;
                        todayArr["주의"] = 0;
                        todayArr["경고"] = 0;
                        todayArr["나쁨"] = 0;
                        todayArr["매우 나쁨"] = 0;


                        for(var i = 0; i < model.length; i++){
                            var checkToday = month+":"+date;

                            if(model[0]["date"] == checkToday) {
                                if(model[0]["middleSlope"] > 2100){
                                    todayArr["정상"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 2000){
                                    todayArr["주의"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 1900){
                                    todayArr["경고"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 1800){
                                    todayArr["나뿜"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 1750){
                                    todayArr["매우 나쁨"]+=1;
                                }


                                if(model[0]["middleSlope"] > 2100){
                                    todayArr["정상"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 2000){
                                    todayArr["주의"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 1900){
                                    todayArr["경고"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 1800){
                                    todayArr["나뿜"]+=1;
                                }
                                else if(model[0]["middleSlope"] > 1750){
                                    todayArr["매우 나쁨"]+=1;
                                }


                                if(model[0]["leftSlope"] < 1550){
                                    todayArr["정상"]+=1;
                                }
                                else if(model[0]["leftSlope"] < 1650){
                                    todayArr["주의"]+=1;
                                }
                                else if(model[0]["leftSlope"] < 1850){
                                    todayArr["경고"]+=1;
                                }
                                else if(model[0]["leftSlope"] < 2050){
                                    todayArr["나뿜"]+=1;
                                }
                                else{
                                    todayArr["매우 나쁨"]+=1;
                                }

                                if(model[0]["rightSlope"] < 1550){
                                    todayArr["정상"]+=1;
                                }
                                else if(model[0]["rightSlope"] < 1650){
                                    todayArr["주의"]+=1;
                                }
                                else if(model[0]["rightSlope"] < 1850){
                                    todayArr["경고"]+=1;
                                }
                                else if(model[0]["rightSlope"] < 2050){
                                    todayArr["나뿜"]+=1;
                                }
                                else{
                                    todayArr["매우 나쁨"]+=1;
                                }
                            }
                        }

                        res.send({
                            "status":200,
                            "data":todayArr
                        });
                    }
                });
            }
        });
    });


    app.get('/alarm/barGraph',(req,res)=>{
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

                    var d = new Date();
                    var day = d.getDay();
                    var date = d.getDate();
                    var month = d.getMonth();

                    var minusDate = day+1;
                    var plusDate = 7 - minusDate;

                    var minDate = date - minusDate;
                    var minMonth = month;

                    var maxDate = date + plusDate;
                    var maxMonth = month;

                    var todayAlarm = new Array();
                    var weekAlarm = new Array();
                    var monthAlarm = new Array();

                    for(var i = 0; i<24; i++){
                        if(i<7){
                            weekAlarm[i] = 0;
                        }
                        todayAlarm[i] = 0;
                    }

                    if(month < 8){
                        if(month%2 == 1){
                            var forVal = 31;
                        }
                        else{
                            var forVal = 30;
                        }
                    }
                    else{
                        if(month%2 == 1){
                            var forVal = 30;
                        }
                        else{
                            var forVal = 31;
                        }
                    }

                    for(var i = 0; i<forVal; i++){
                        monthAlarm[i] = 0;
                    }

                    if(minDate < 0){
                        minMonth-=1;

                        if(minMonth < 8){
                            if(minMonth %2 == 1){
                                minDate = 31 + minDate;
                            }
                            else{
                                minDate = 30 + minDate;
                            }
                        }
                        else{
                            if(minMonth %2 == 1){
                                minDate = 30 + minDate;
                            }
                            else{
                                minDate = 31 + minDate;
                            }
                        }
                    }

                    if(maxMonth+1 < 8){
                        if(maxMonth + 1 %2 == 1){
                            if(maxDate > 31){
                                maxMonth += 1;
                                maxDate = 1+maxDate;
                            }
                        }
                        else{
                            if(maxDate > 30){
                                maxMonth += 1;
                                maxDate = 1+maxDate;
                            }
                        }
                    }
                    else{
                        if(maxMonth + 1 %2 == 1){
                            if(maxDate > 30){
                                maxMonth += 1;
                                maxDate = 1+maxDate;
                            }
                        }
                        else{
                            if(maxDate > 31){
                                maxMonth += 1;
                                maxDate = 1+maxDate;
                            }
                        }
                    }


                });
            }
        });
    });

    app.post('/alarm/checkWeeklyAward',(req,res)=>{
        var token = req.body.token;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                settingModel.find({"token":token},(err,m)=>{
                    if(err) throw err;

                    if(m.length == 0){
                        res.send({
                            "status":404,
                            "message":"please initialize your setting"
                        });
                    }
                    else{
                        alarmModel.find({"token":token},(err,mo)=>{
                            if(err) throw err;

                            if(mo.length == 0){
                                res.send({
                                    "status":404,
                                    "message":"no data for user neck"
                                });
                            }
                            else{
                                var userAlarm = mo[0]["weekAlarm"];
                                var userAward = m[0]["weeklyAward"];

                                if(userAlarm > userAward){
                                    res.send({
                                        "status":200,
                                        "result":true
                                    });

                                    // 넘김
                                }
                                else{
                                    res.send({
                                        "status":200,
                                        "result":false
                                    });

                                    // 안넘김
                                }

                            }
                        });
                    }
                });
            }
        });


        function reset(){
            var d = new Date();

            var hour = d.getHours();
            var sec = d.getSeconds();
            var day = d.getDay();
            var date = d.getDate();
        }
    });
}
