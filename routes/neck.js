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
                                var middle = model[i]["middleSlope"];
                                var left = model[i]["leftSlope"];
                                var right = model[i]["rightSlope"];
                                hour[inputHour] += slope;
                                hourLength[i]+=1;
                            }

                        }


                        for(var i = 0; i<24; i++){
                            if(hour[i] == 0){
                                returnArr[i] = "none";
                            }
                            else{
                                console.log(hour[i] +" : "+hourLength);
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
                    else {

                        var return1;
                        var return2;
                        var return3;

                        var d = new Date();
                        var date = d.getDate();

                        var oneday = 0;
                        var twoday = 0;

                        var month = d.getMonth();

                        var oneMonth = month;
                        var twoMonth = month;

                        var firstCheckArr = new Array();

                        firstCheckArr[0] = 0;
                        firstCheckArr[1] = 0;
                        firstCheckArr[2] = 0;
                        firstCheckArr[3] = 0;
                        firstCheckArr[4] = 0;

                        var secCheckArr = new Array();

                        secCheckArr[0] = 0;
                        secCheckArr[1] = 0;
                        secCheckArr[2] = 0;
                        secCheckArr[3] = 0;
                        secCheckArr[4] = 0;

                        var thirdCheckArr = new Array();

                        thirdCheckArr[0] = 0;
                        thirdCheckArr[1] = 0;
                        thirdCheckArr[2] = 0;
                        thirdCheckArr[3] = 0;
                        thirdCheckArr[4] = 0;

                        if(date - 1 == 0){
                            if(month - 1 < 8){
                                if((month - 1)%2 == 1){
                                    oneday = 31;
                                }
                                else{
                                    oneday = 30;
                                }
                            }
                            else{
                                if((month - 1)%2 == 1){
                                    oneday = 30;
                                }
                                else{
                                    oneday = 31;
                                }
                            }
                            oneMonth--;
                        }
                        else{
                            oneday = date - 1;
                        }

                        if(oneday - 1 == 0){
                            if(month - 1 < 8){
                                if((month - 1)%2 == 1){
                                    twoday = 31;
                                }
                                else{
                                    twoday = 30;
                                }
                            }
                            else{
                                if((month - 1)%2 == 1){
                                    twoday = 30;
                                }
                                else{
                                    twoday = 31;
                                }
                            }
                            twoMonth--;
                        }
                        else{
                            twoday = date - 2;
                        }

                        userAlarmModel.find({"token":token},(err,model)=>{
                            if(err) throw err;

                            if(model.length == 0){
                                res.send({
                                    "status":404,
                                    "message":"no data in user alarm"
                                });
                            }
                            else{
                                for(var i = 0; i<model.length; i++){
                                    if(model[i]["date"] == month+":"+date){
                                        var middle = model[i]["middleSlope"] - 1;
                                        firstCheckArr[middle]++;
                                        var left = model[i]["leftSlope"] - 1;
                                        firstCheckArr[left]++;
                                        var right = model[i]["rightSlope"] - 1;
                                        firstCheckArr[right]++;
                                    }
                                    else if(model[i]["date"] == oneMonth+":"+oneday){
                                        var middle = model[i]["middleSlope"] - 1;
                                        secCheckArr[middle]++;
                                        var left = model[i]["leftSlope"] - 1;
                                        secCheckArr[left]++;
                                        var right = model[i]["rightSlope"] - 1;
                                        secCheckArr[right]++;
                                    }
                                    else if(model[i]["date"] == twoMonth+":"+twoday){
                                        var middle = model[i]["middleSlope"] - 1;
                                        thirdCheckArr[middle]++;
                                        var left = model[i]["leftSlope"] - 1;
                                        thirdCheckArr[left]++;
                                        var right = model[i]["rightSlope"] - 1;
                                        thirdCheckArr[right]++;
                                    }
                                }

                                var frMax = 0;
                                var secMax = 0;
                                var thirdMax = 0;

                                var frNum = 0;
                                var secNum = 0;
                                var thirdNum = 0;

                                for(var i = 0; i<5; i++){
                                    if(i == 0){
                                        frMax = firstCheckArr[i];
                                        secMax = secCheckArr[i];
                                        thirdMax = thirdCheckArr[i];

                                        frNum = i + 1;
                                        secNum = i + 1;
                                        thirdNum = i + 1;
                                    }
                                    else{
                                        if(frMax < firstCheckArr[i]){
                                            frMax = firstCheckArr[i];

                                            frNum = i + 1;
                                        }

                                        if(secMax < secCheckArr[i]){
                                            secMax = secCheckArr[i];

                                            secNum = i + 1;
                                        }

                                        if(thirdMax < thirdCheckArr[i]){
                                            thirdMax = thirdCheckArr[i];

                                            thirdNum = i + 1;
                                        }
                                    }
                                }

                                res.send({
                                    "status":200,
                                    "today":frNum,
                                    "yesterday":secNum,
                                    "doubleday":thirdNum
                                });
                            }

                        });

                    }
                });
            }
        });
    });

    app.get('/neck/list',(req,res)=>{
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
                            "message":"user alarm data not found"
                        });
                    }
                    else{
                        res.send({
                            "status":200,
                            "data":model
                        });
                    }
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