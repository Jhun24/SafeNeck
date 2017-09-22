/**
 * Created by janghunlee on 2017. 9. 8..
 */
module.exports = alarm;

function alarm(app,alarmModel,userModel,settingModel){
    "use strict";
    app.get('/alarm/add/daily',(req,res)=>{
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
                alarmModel.find({"token":token},(err,m)=>{
                    if(err) throw err;
                    if(m.length == 0){
                        var saveAlarmModel = new alarmModel({
                            token:token,
                            todayAlarm:"1",
                            monthAlarm:"1",
                            weekAlarm:"1"
                        });

                        saveAlarmModel.save((err,mo)=>{
                            if(err) throw err;
                            res.send({
                                "status":200,
                                "data":mo
                            });
                        });
                    }
                    else{
                        var dailyAdd = m[0]["todayAlarm"] + 1;
                        var monthAdd = m[0]["monthAlarm"] + 1;
                        var weekAdd = m[0]["weekAlarm"] + 1;

                        alarmModel.update({"token":token},{$set:{"todayAlarm":dailyAdd,"monthAlarm":monthAdd,"weekAlarm":weekAdd}},(err,mo)=>{
                            if(err) throw err;
                            res.send({
                                "status":200,
                                "data":mo
                            });
                        });
                    }
                });
            }
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
    });


}