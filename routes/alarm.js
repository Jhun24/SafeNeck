/**
 * Created by janghunlee on 2017. 9. 8..
 */
module.exports = alarm;

function alarm(app,alarmModel,userModel,settingModel,userAlarmModel){
    "use strict";
    app.get('/alarm/add/daily',(req,res)=>{
        var token = req.query.token;

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
                        });
                    }
                    else{
                        var dailyAdd = m[0]["todayAlarm"] + 1;
                        var monthAdd = m[0]["monthAlarm"] + 1;
                        var weekAdd = m[0]["weekAlarm"] + 1;

                        alarmModel.update({"token":token},{$set:{"todayAlarm":dailyAdd,"monthAlarm":monthAdd,"weekAlarm":weekAdd}},(err,mo)=>{
                            if(err) throw err;
                        });
                    }

                    console.log(m);

                    res.send({
                        "status":200,
                        "data":m
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
                        console.log(mo);
                        model[model.length] = mo;
                        res.send({
                            "status":200,
                            "data":model
                        });
                    });
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
    
    app.get('/alarm/circleGraph',(req,res)=>{
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
                            "message":"no data in user neck data"
                        });
                    }
                    else{
                        var d = new Date();
                        var day = d.getDay();
                        var date = d.getDate();
                        var month = d.getMonth();


                        var todayArr = new Array();

                        todayArr = {
                            "fine":0,
                            "caution":0,
                            "warning":0,
                            "bad":0,
                            "verybad":0
                        };
                        console.log(todayArr);

                        console.log(model[0]);
                        for(var i = 0; i < model.length; i++){
                            var checkToday = month+":"+date;

                            if(model[0]["date"] == checkToday) {


                                if(model[0]["middleSlope"] == 1){
                                    todayArr["fine"]++;
                                }
                                else if(model[0]["middleSlope"] == 2){
                                    todayArr["caution"]++;
                                }
                                else if(model[0]["middleSlope"] == 3){
                                    todayArr["warning"]++;
                                }
                                else if(model[0]["middleSlope"] == 4){
                                    todayArr["bad"]++;
                                }
                                else if(model[0]["middleSlope"] == 5){
                                    todayArr["verybad"]++;
                                }


                                if(model[0]["leftSlope"] == 1){
                                    todayArr["fine"]++;
                                }
                                else if(model[0]["leftSlope"] == 2){
                                    todayArr["caution"]++;
                                }
                                else if(model[0]["leftSlope"] == 3){
                                    todayArr["warning"]++;
                                }
                                else if(model[0]["leftSlope"] == 4){
                                    todayArr["bad"]++;
                                }
                                else{
                                    todayArr["verybad"]++;
                                }

                                if(model[0]["rightSlope"] == 1){
                                    todayArr["fine"]++;
                                }
                                else if(model[0]["rightSlope"] == 2){
                                    todayArr["caution"]++;
                                }
                                else if(model[0]["rightSlope"] == 3){
                                    todayArr["warning"]++;
                                }
                                else if(model[0]["rightSlope"] == 4){
                                    todayArr["bad"]++;
                                }
                                else{
                                    todayArr["verybad"]++;
                                }
                            }
                        }
                        console.log(todayArr);
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

                    var weekCheckArr = new Array();

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

                            var forMinDate = minDate * -1;
                            for(var i = 0; i<forMinDate; i++){
                                weekCheckArr[weekCheckArr.length] = minDate + i;
                            }
                            for(var i = 1; i<maxDate; i++){
                                weekCheckArr[weekCheckArr.length] = i;
                            }
                        }
                        else{
                            if(minMonth %2 == 1){
                                minDate = 30 + minDate;
                            }
                            else{
                                minDate = 31 + minDate;
                            }

                            var forMinDate = minDate * -1;
                            for(var i = 0; i<forMinDate; i++){
                                weekCheckArr[weekCheckArr.length] = minDate + i;
                            }
                            for(var i = 1; i<maxDate; i++){
                                weekCheckArr[weekCheckArr.length] = i;
                            }
                        }
                    }
                    else if(maxDate - minDate == 7){
                        var forMinDate = minDate;

                        for(var i = 0; i<7; i++){
                            weekCheckArr[i] = forMinDate;
                            forMinDate+=1;
                        }
                    }
                    else{
                        if(maxMonth+1 < 8){
                            if(maxMonth + 1 %2 == 1){
                                if(maxDate > 31){
                                    maxMonth += 1;
                                    maxDate = maxDate - 31;
                                }
                            }
                            else{
                                if(maxDate > 30){
                                    maxMonth += 1;
                                    maxDate = maxDate - 30;
                                }
                            }

                            var checkMindate = minDate;

                            for(var i = 0 ; i < 7 - maxDate; i++ ){
                                weekCheckArr[i] = minDate;
                                minDate += 1;
                            }
                            var check = 1;
                            for(var i = 7 - maxDate; i<7; i++){
                                weekCheckArr[i] = check;

                                check += 1;
                            }
                        }
                        else{
                            if(maxMonth + 1 %2 == 1){
                                if(maxDate > 30){
                                    maxMonth += 1;
                                    maxDate = maxDate - 30;
                                }
                            }
                            else{
                                if(maxDate > 31){
                                    maxMonth += 1;
                                    maxDate = maxDate - 31;
                                }
                            }

                            var checkMindate = minDate;

                            for(var i = 0 ; i < 7 - maxDate; i++ ){
                                weekCheckArr[i] = minDate;
                                minDate += 1;
                            }
                            var check = 1;
                            for(var i = 7 - maxDate; i<7; i++){
                                weekCheckArr[i] = check;

                                check += 1;
                            }
                        }
                    }

                    var checkDate = month+":"+date;

                    for(var i = 0; i<model.length; i++){
                        if(model[i]["date"] == checkDate){
                            var inputTime = model[i]["time"];
                            console.log("Input Time start" + inputTime);
                            if(model[i]["middleSlope"] > 1){
                                todayAlarm[inputTime] += 1;
                            }
                            else if(model[i]["leftSlope"] > 1){
                                todayAlarm[inputTime] += 1;
                            }
                            else if(model[i]["rightSlope"] > 1){
                                todayAlarm[inputTime] += 1;
                            }
                        }

                        if(model[i]["date"].indexOf(month) != -1){
                            var inputDate = model[i]["date"].replace(month+":","");
                            console.log(inputDate);
                            if(model[i]["middleSlope"] > 1){
                                monthAlarm[inputDate] += 1;
                            }
                            else if(model[i]["leftSlope"] > 1){
                                monthAlarm[inputDate] += 1;
                            }
                            else if(model[i]["rightSlope"] > 1){
                                monthAlarm[inputDate] += 1;
                            }
                        }

                        var weekCheckMonth = minMonth;

                        for(var e = 0; e<7; e++){

                            var weekCheckInputMonth = weekCheckMonth+":"+weekCheckArr[e];

                            if(model[i]["date"] == weekCheckInputMonth){
                                if(model[i]["middleSlope"] > 1){
                                    weekAlarm[e] += 1;
                                }
                                else if(model[i]["leftSlope"] > 1){
                                    weekAlarm[e] += 1;
                                }
                                else if(model[i]["rightSlope"] > 1){
                                    weekAlarm[e] += 1;
                                }
                            }

                            if((e != 6 && weekCheckArr[e] == 31) || (e != 6 && weekCheckArr[e] == 30 && weekCheckArr[e+1] == 1)){
                                weekCheckMonth = maxMonth;
                            }
                        }
                    }
                    res.send({
                        "status":200,
                        "today":todayAlarm,
                        "week":weekAlarm,
                        "month":monthAlarm
                    })
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

    function reset(){
        var d = new Date();
        var hour = d.getHours();
        var sec = d.getSeconds();
        var day = d.getDay();
        var date = d.getDate();
        var min = d.getMinutes();

        if(date == 1 && hour == 0 && min == 0 && sec == 0){
            alarmModel.update({},{$set:{"monthAlarm":0}},(err,model)=>{
                if(err) throw err;
                console.log("User AlarmModel [monthAlarm] Reset Success");
            });
        }
        else if(day == 0 & hour == 0 && min == 0 && sec == 0){
            alarmModel.update({},{$set:{"weekAlarm":0}},(err,model)=>{
                if(err) throw err;
                console.log("User AlarmModel [weekAlarm] Reset Success");
            });
        }
        else if(hour == 0 && min == 0 && sec == 0){
            alarmModel.update({},{$set:{"todayAlarm":0}},(err,model)=>{
                if(err) throw err;
                console.log("User AlarmModel [todayAlarm] Reset Success");
            });
        }
    }

    setInterval(reset,1000);
}
