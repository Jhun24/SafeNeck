/**
 * Created by janghunlee on 2017. 9. 20..
 */
var sex = "남자";
var token;
$(document).ready(function () {
    $.ajax({
        method:"GET",
        url:"/auth/getToken",
        success:function (data) {
            console.log(data);
            if(data["status"] == 200){
                token = data["token"];
            }
            else if(data["status"] == 404){
                location.href="/"
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});

$(".male").click(function () {
    $(".male").removeClass("unclick");
    $(".male").addClass("click");

    $(".female").removeClass("click");
    $(".female").addClass("unclick");

    var sex = "남자";

});

$(".female").click(function () {
    $(".female").removeClass("unclick");
    $(".female").addClass("click");

    $(".male").removeClass("click");
    $(".male").addClass("unclick");

    var sex = "여자";
});

$(".start").click(function () {
    var age = $(".age").val();
    var work = $(".work").val();

    $.ajax({
        method:"POST",
        url:"/auth/init",
        data:{"token":token,"age":age,"work":work,"sex":sex},
        success:function (data) {
            if(data["status"] == 200){
                location.href="/main"
            }
            else if(data["status"] == 404){
                alert("서버 오류");
            }
        },
        error:function (err) {
            console.log(err);
        }
    });
});