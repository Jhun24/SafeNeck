/**
 * Created by janghunlee on 2017. 9. 8..
 */
module.exports = setting;

function setting(app , userModel , settingModel){
    "use strict";
    app.post('/setting/reportTime',(req,res)=>{
        var token = req.body.token;
        var time = req.body.time;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                settingModel.update({"token":token},{$set:{"reportTime":time}},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send({
                            "status":400,
                            "message":"user token undefinded"
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

    app.post('/setting/dailyAward',(req,res)=>{
        var token = req.body.token;
        var dailyAward = req.body.dailyAward;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                settingModel.update({"token":token},{$set:{"dailyAward":dailyAward}},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send({
                            "status":400,
                            "message":"user token not definded"
                        });
                    }
                    else{
                        console.log(model);
                        console.log(dailyAward);
                        res.send({
                            "status":200,
                            "data":model
                        });
                    }
                });
            }
        });

    });

    app.post('/setting/weeklyAward',(req,res)=>{
        var token = req.body.token;
        var weeklyAward = req.body.weeklyAward;

        userModel.find({"token":token},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                settingModel.update({"token":token},{$set:{"weeklyAward":weeklyAward}},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        res.send({
                            "status":404,
                            "message":"user token not definded"
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

    app.get('/setting/list',(req,res)=>{
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
                settingModel.find({"token":token},(err,model)=>{
                    if(err) throw err;
                    if(model.length == 0){
                        var saveSettingModel = new settingModel({
                            "token":token,
                            "time":"22",
                            "weeklyAward":"140",
                            "dailyAward":"20"
                        });

                        saveSettingModel.save((err,m)=>{
                            if(err) throw err;
                            res.send({
                                "status":200,
                                "data":{
                                    "token":token,
                                    "time":"22",
                                    "weeklyAward":"140",
                                    "dailyAward":"20"
                                }
                            });
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
}