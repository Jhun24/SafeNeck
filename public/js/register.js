/**
 * Created by janghunlee on 2017. 9. 20..
 */
$(".register").click(function(){
    "use strict";
    location.href="";
});

$(".login").click(function(){
    "use strict";
    location.href="/login"
});

$(".btn-register").click(function(){
    "use strict";
    var psCheck = $(".ps-check").val();
    var ps = $(".ps").val();


    if(ps == psCheck){
        var name = $(".name").val();
        var id = $(".id").val();

        $.ajax({
            method:"POST",
            data:{"id":id,"password":ps,"name":name},
            url:"/auth/register",
            success:function (data) {
                if(data["status"] == 200){
                    location.href="/setting"
                }
                else if(data["status"] == 403){
                    alert("이미 존재하는 아이디입니다");
                }
            },
            error:function (err) {
                console.log(err);
            }
        });
    }
    else{
        alert("비밀번호가 일치하지 않습니다");
    }
});