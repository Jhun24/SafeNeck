/**
 * Created by janghunlee on 2017. 9. 4..
 */
module.exports = auth;

function auth(app , randomstring , userModel , NaverStrategy , passport){
    "use strict";

    app.post('/auth/login',(req,res)=>{
        var id = req.body.id;
        var password = req.body.password;

        userModel.find({"id":id,"password":password},(err,model)=>{
            if(err) throw err;

            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                res.send({
                    "status":200,
                    "data":model[0]
                });
            }
        });
    });

    app.post('/auth/register',(req,res)=>{
        var id = req.body.id;
        var password = req.body.password;
        var name = req.body.name;
        var token = randomstring.generate();

        userModel.find({"id":id},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                var saveUserModel = new userModel({
                    "id":id,
                    "password":password,
                    "name":name,
                    "token":token
                });

                saveUserModel.save((err,m)=>{
                    if(err) throw err;
                    res.send({
                        "status":200,
                        "data":m[0]
                    });
                });
            }
            else{
                res.send({
                    "status":403,
                    "message":"user alreay sign up"
                });
            }
        });
    });

    app.post('/auth/init',(req,res)=>{
        var token = req.body.token;

        var age = req.body.age;
        var sex = req.body.sex;
        var work = req.body.work;

        model.find({"token":token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send({
                    "status":404,
                    "message":"user not found"
                });
            }
            else{
                model.update({"token":token},{$set:{"age":age,"sex":sex,"work":work}},(error,m)=>{
                    if(error) throw error;
                    res.send({
                        "status":200
                    });
                });
            }
        });
    });

    app.get('/auth/naver',
        passport.authenticate('naver', null), function(req, res) { // @todo Additional handler is necessary. Remove?
            console.log('/auth/naver failed, stopped');
        });

// creates an account if no account of the new user
    app.get('/auth/naver/callback',
        passport.authenticate('naver', {
            failureRedirect: '#!/auth/login'
        }), function(req, res) {
            res.redirect('/');
        });
    //
    // app.post('/auth/naver_login',(req,res)=>{
    //
    // });
}