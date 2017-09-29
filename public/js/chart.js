/**
 * Created by janghunlee on 2017. 9. 17..
 */

$(document).ready(function () {
    $.ajax({
        url:"/auth/getToken",
        method:"GET",
        success:function (data) {
            var status = data["status"];

            if(status == 404){
                location.href="/"
            }
            else{
                var token = data["token"];
                $.ajax({
                    method:"GET",
                    url:"/alarm/circleGraph",
                    data:{"token":token},
                    success:function (data) {
                        var userData = {
                            "정상":data["data"]["fine"],
                            "주의":data["data"]["caution"],
                           "경고":data["data"]["warning"],
                            "나쁨":data["data"]["bad"],
                            "매우 나쁨":data["data"]["verybad"]
                        }

                        var chartDonut = c3.generate({
                            bindto: '#user-chart',
                            data: {
                                json: [userData],
                                keys: {
                                    value: Object.keys(userData),
                                },
                                type: "donut",
                                colors:{
                                    "정상":"#56BCA6",
                                    "주의":"rgb(46,124,114)",
                                    "경고":"rgb(66,82,88)",
                                    "나쁨":"rgb(152,45,36);",
                                    "매우 나쁨":"rgb(175,55,49)"
                                }
                            },
                            donut: {
                                title: "사용자의 목 상태",
                            }
                        });

                        $(".graph-text-sogood-text").text(userData["정상"]+" %");
                        $(".graph-text-good-text").text(userData["주의"]+" %");
                        $(".graph-text-normal-text").text(userData["경고"]+" %");
                        $(".graph-text-bad-text").text(userData["나쁨"]+" %");
                        $(".graph-text-sobad-text").text(userData["매우 나쁨"]+" %");
                    },
                    error:function (err) {
                        console.log(err);
                    }
                });

                $.ajax({
                    method:"GET",
                    url:"/alarm/getData",
                    data:{"token":token},
                    success:function (data) {
                        console.log(data);
                        if(data["status"] == 404){
                            $(".day-num").text(0);
                            $(".week-num").text(0);
                        }
                        else{
                            $(".day-num").text(data["todayAlarm"]);
                            $(".week-num").text(data["weekAlarm"]);
                        }
                    },
                    error:function (err) {
                        console.log(err);
                    }
                });

                $.ajax({
                    method:"GET",
                    url:"/neck/checkDay",
                    data:{"token":token},
                    success:function (data) {
                        var result1 = "";
                        var result2 = "";
                        var result3 = "";

                        if(data["today"] == 1){
                            result1+="<div class=\"user-change-img-sogood\"></div>"
                            result1+="<h3 class=\"text-sogood\">정상</h3>"
                            result1+="<p>현재 상태</p>"
                        }
                        else if(data["today"] == 2){
                            result1+="<div class=\"user-change-img-good\"></div>"
                            result1+="<h3 class=\"text-good\">주의</h3>"
                            result1+="<p>현재 상태</p>"

                        }
                        else if(data["today"] == 3){
                            result1+="<div class=\"user-change-img-normal\"></div>"
                            result1+="<h3 class=\"text-normal\">경고</h3>"
                            result1+="<p>현재 상태</p>"
                        }
                        else if(data["today"] == 4){
                            result1+="<div class=\"user-change-img-bad\"></div>"
                            result1+="<h3 class=\"text-bad\">나쁨</h3>"
                            result1+="<p>현재 상태</p>"
                        }
                        else if(data["today"] == 5){
                            result1+="<div class=\"user-change-img-sobad\"></div>"
                            result1+="<h3 class=\"text-sobad\">매우 나쁨</h3>"
                            result1+="<p>현재 상태</p>"
                        }

                        if(data["yesterday"] == 1){
                            result2+="<div class=\"user-change-img-sogood\"></div>"
                            result2+="<h3 class=\"text-sogood\">정상</h3>"
                            result2+="<p>1일전 상태</p>"
                        }
                        else if(data["yesterday"] == 2){
                            result2+="<div class=\"user-change-img-good\"></div>"
                            result2+="<h3 class=\"text-good\">주의</h3>"
                            result2+="<p>1일전 상태</p>"

                        }
                        else if(data["yesterday"] == 3){
                            result2+="<div class=\"user-change-img-normal\"></div>"
                            result2+="<h3 class=\"text-normal\">경고</h3>"
                            result2+="<p>1일전 상태</p>"
                        }
                        else if(data["yesterday"] == 4){
                            result2+="<div class=\"user-change-img-bad\"></div>"
                            result2+="<h3 class=\"text-bad\">나쁨</h3>"
                            result2+="<p>1일전 상태</p>"
                        }
                        else if(data["yesterday"] == 5){
                            result2+="<div class=\"user-change-img-sobad\"></div>"
                            result2+="<h3 class=\"text-sobad\">매우 나쁨</h3>"
                            result2+="<p>1일전 상태</p>"
                        }

                        if(data["doubleday"] == 1){
                            result3+="<div class=\"user-change-img-sogood\"></div>"
                            result3+="<h3 class=\"text-sogood\">정상</h3>"
                            result3+="<p>2일전 상태</p>"
                        }
                        else if(data["doubleday"] == 2){
                            result3+="<div class=\"user-change-img-good\"></div>"
                            result3+="<h3 class=\"text-good\">주의</h3>"
                            result3+="<p>2일전 상태</p>"

                        }
                        else if(data["doubleday"] == 3){
                            result3+="<div class=\"user-change-img-normal\"></div>"
                            result3+="<h3 class=\"text-normal\">경고</h3>"
                            result3+="<p>2일전 상태</p>"
                        }
                        else if(data["doubleday"] == 4){
                            result3+="<div class=\"user-change-img-bad\"></div>"
                            result3+="<h3 class=\"text-bad\">나쁨</h3>"
                            result3+="<p>2일전 상태</p>"
                        }
                        else if(data["doubleday"] == 5){
                            result3+="<div class=\"user-change-img-sobad\"></div>"
                            result3+="<h3 class=\"text-sobad\">매우 나쁨</h3>"
                            result3+="<p>2일전 상태</p>"
                        }

                        $(".day").html(result3);
                        $(".day").html(result2);
                        $(".day").html(result1);
                    },
                    error:function (err) {
                        console.log(err);
                    }
                });
            }
        },
        error:function (err) {
            console.log(err);
        }
    });

    $(".daily-content").css({"display":"none"});
    $(".setting-popup").css({"display":"none"});
});

$(".btn").click(function () {
    var text = $(this).text();
    console.log(text);


    if(text == "메인"){

        $(".main").removeClass("unclick");
        $(".daily").removeClass("unclick");
        $(".setting").removeClass("unclick");
        $(".logout").removeClass("unclick");

        $(".daily").removeClass("click");
        $(".setting").removeClass("click");
        $(".logout").removeClass("click");

        $(".main").addClass("click");
        $(".daily").addClass("unclick");
        $(".setting").addClass("unclick");
        $(".logout").addClass("unclick");

        $(".daily-content").css({"display":"none"});
        $(".user-content").css({"display":"flex"});
        $(".setting-popup").css({"display":"none"});
    }
    else if(text == "리포트"){
        $(".main").removeClass("unclick");
        $(".daily").removeClass("unclick");
        $(".setting").removeClass("unclick");
        $(".logout").removeClass("unclick");

        $(".main").removeClass("click");
        $(".setting").removeClass("click");
        $(".logout").removeClass("click");

        $(".main").addClass("unclick");
        $(".daily").addClass("click");
        $(".setting").addClass("unclick");
        $(".logout").addClass("unclick");

        $(".daily-content").css({"display":"flex"});
        $(".user-content").css({"display":"none"});
        $(".setting-popup").css({"display":"none"});
    }
    else if(text == "설정"){
        $(".main").removeClass("unclick");
        $(".daily").removeClass("unclick");
        $(".setting").removeClass("unclick");
        $(".logout").removeClass("unclick");

        $(".main").removeClass("click");
        $(".daily").removeClass("click");
        $(".logout").removeClass("click");

        $(".main").addClass("unclick");
        $(".daily").addClass("unclick");
        $(".setting").addClass("click");
        $(".logout").addClass("unclick");

        // $(".daily-contents").addClass("none");
        // $(".user-content").addClass("none");
        $(".setting-popup").css({"display":"flex"});
    }
    else if(text == "로그아웃"){
        location.href = "/"
    }
});

$(".setting-agree").click(function () {
    $(".setting-popup").css({"display":"none"});
});

$(".setting-cancel").click(function () {
    $(".setting-popup").css({"display":"none"});
});
