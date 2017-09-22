/**
 * Created by janghunlee on 2017. 9. 22..
 */
module.exports = neck;

function neck(app , userModel , userNeckModel , neckModel){
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