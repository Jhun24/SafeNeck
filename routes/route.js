/**
 * Created by janghunlee on 2017. 9. 20..
 */
module.exports = route;

function route(app){
    "use strict";
    app.get("/",(req,res)=>{
        res.render('index.html');
    });

    app.get("/login",(req,res)=>{
        res.render('login.html');
    });

    app.get('/register',(req,res)=>{
        res.render('register.html');
    });

    app.get('/main',(req,res)=>{
        res.render('main.html');
    });

    app.get('/setting',(req,res)=>{
        res.render('firstSetting.html');
    });
}