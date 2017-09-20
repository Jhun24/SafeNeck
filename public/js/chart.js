/**
 * Created by janghunlee on 2017. 9. 17..
 */

var userData = {
    "매우 좋음":20,
    "좋음":20,
    "보통":20,
    "나쁨":20,
    "매우 나쁨":20
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
            "매우 좋음":"#56BCA6",
            "좋음":"rgb(46,124,114)",
            "보통":"rgb(66,82,88)",
            "나쁨":"rgb(152,45,36);",
            "매우 나쁨":"rgb(175,55,49)"
        }
    },
    donut: {
        title: "사용자의 목 상태",
    }
});

$(".graph-text-sogood-text").text(userData["매우 좋음"]+" %");
$(".graph-text-good-text").text(userData["좋음"]+" %");
$(".graph-text-normal-text").text(userData["보통"]+" %");
$(".graph-text-bad-text").text(userData["나쁨"]+" %");
$(".graph-text-sobad-text").text(userData["매우 나쁨"]+" %");