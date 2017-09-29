/**
 * Created by janghunlee on 2017. 9. 20..
 */
$(".register").click(function(){
    "use strict";
    location.href="";
});

$(".login").click(function () {
    location.href="/register";
});

$(".login-btn").click(function () {
    var id = $(".id").val();
    var ps = $(".ps").val();
    
    $.ajax({
        method:"POST",
        url:"/auth/login",
        data:{"id":id,"password":ps},
        success:function (data) {
            console.log(data);
            var status = data["status"];

            if(status == 404){
                alert("존재하지 않는 아이디입니다");
                location.href="/register";
            }
            else if(status == 200){
                location.href="/main";
            }
        },
        error:function (err) {
            "use strict";
            console.log(err);
        }
    });
});