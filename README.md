# SafeNeck

# Schema

### user Schema

    name : String

>   유저 이름을 의미합니다

    id : String
    
>   유저 id를 의미합니다

    password : String
    
>   유저 password를 의미합니다

    age : String
    
>   유저 나이를 의미합니다

    sex : String

>   유저 성별을 의미합니다

    work : String

>   유저 직업을 의미합니다

    token : String

>   유저 토큰을 의미합니다

### alarm Schema

    token : String
    
>   유저 토큰을 의미합니다

    todayAlarm : String
    
>   일일 알람을 의미합니다
 
    weekAlarm : String
    
>   주간 알람을 의미합니다

    monthAlarm : String

>   월간 알림을 의미합니다

### setting Schema
 
    token : String
    
>   유저 토큰을 의미합니다

    reportTime : String

>   리포트를 보낼 시간을 의미합니다

    dailyAward : String

>   하루 동안 자세 경고 알림 목표 개수를 의미합니다

    weeklyAward : String

>   주간 자세 경고 알림 목표 개수를 의미합니다

### userAlarm Schema

    token : String

>   유저 토큰을 의미합니다

    date : String

>   기울기가 저장된 날짜를 의미합니다

    time : String

>   기울기가 저장된 시간을 의미합니다

    slope : String

>   사용자의 목 기울기를 의미합니다

# /auth

### : POST /auth/login

> require

    id : 유저 id
    
    password : 유저 password
    
> response : Success

    status : 200
    
    data : 유저 object (user Schema 참조)
    
> response : Fail
    
    status : 404
    
    message : user not found
    
    
### : POST /auth/register

> require

    id : 유저 id
    
    password : 유저 password
    
    name : 유저 이름
    
    
> response : Success

    status : 200
    
    data : 유저 object (user Schema 참조)
    
> response : Fail
    
    status : 404
    
    message : user already sign up
    
### : POST /auth/init

> require

    token : 유저 token
    
    age : 유저 나이
    
    sex : 유저 성별
    
    work : 유저 직업
    
    
> response : Success

    status : 200
    
    
> response : Fail
    
    status : 404
    
    message : user not found
    
### : GET /auth/getToken

> require
    
    없음
    
> response : success

    status : 200
    
    token : 유저 토큰

> response : fail

    status : 404
    
    message : token undefinded

# /alram

### : GET /alarm/add/daily

> require
    
    token : 유저 토큰
    
    slope : 유저 목 기울긴
    
> response : success

    status : 200
    
    data[0] : alarm Schema 참조
    
    data[1] : userAlarm Schema 참조
    
> response : fail

    status : 404
    
    message : user not found


### : GET /alarm/getData

> require
    
    token : 유저 토큰
    
> response : success
    
    status : 200
    
    data : alarm Schema 참조
    
> response : fail

    status : 404
    
    message : user not found

    
### : POST /alarm/checkDailyAward
    
> require
    
    token : 유저 토큰

> response : success

    status : 200
    
    result : true == 목표량 넘김
    
    result : false == 목표랑 안넘김
           
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 404
    
    message : please initialize your setting

> response : fail

    status : 404
    
    message : no data for user neck

### : POST /alarm/checkWeeklyAward
    
> require
    
    token : 유저 토큰

> response : success

    status : 200
    
    result : true == 목표량 넘김
    
    result : false == 목표랑 안넘김
           
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 404
    
    message : please initialize your setting

> response : fail

    status : 404
    
    message : no data for user neck
 

# setting

### : POST /setting/reportTime

> require

    token : 유저 토큰
    
    time : 업데이트할 리포트 알림 시간

> response : success
 
    status : 200
    
    data : setting model 참고
    
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 400
    
    message : user token undefinded

### : POST /setting/dailyAward

> require

    token : 유저 토큰
    
    dailyAward : 업데이트할 하루 동안 자세 경고 알림 목표 개수

> response : success
 
    status : 200
    
    data : setting model 참고
    
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 400
    
    message : user token undefinded

### : POST /setting/weeklyAward

> require

    token : 유저 토큰
    
    weeklyAward : 업데이트할 주간 자세 경고 알림 목표 개수

> response : success
 
    status : 200
    
    data : setting model 참고
    
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 400
    
    message : user token undefinded


### : GET /setting/list

> require

    token : 유저 토큰

> response : success
 
    status : 200
    
    data : setting model 참고
    
> response : fail

    status : 404
    
    message : user not found

# neck

### : POST /neck/checkToday

> require

    token : 유저 토큰
    
> response

    stauts : 200
    
    data : return arr
    
    returnArray[0 ~ 23]
    배열의 인자값은 시간을 의미
    
    아무런 데이터가 없으면 : none
    
    정상인 경우 : 정상
    주의인 경우 : 주의
    경고인 경우 : 경고
    나쁨인 경우 : 나쁨
    매우 나쁨은 경우 : 매우 나쁨
    
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 404
    
    message : user neck data not found

### : POST /neck/checkDay

> require

    token : 유저 토큰
    
> response

    stauts : 200
    
    today : 오늘 자세 평가
    
    아무런 데이터가 없으면 : none
        
    정상인 경우 : 정상
    주의인 경우 : 주의
    경고인 경우 : 경고
    나쁨인 경우 : 나쁨
    매우 나쁨은 경우 : 매우 나쁨
    
    yesterday : 어제 자세 평가
        
    아무런 데이터가 없으면 : none
        
    정상인 경우 : 정상
    주의인 경우 : 주의
    경고인 경우 : 경고
    나쁨인 경우 : 나쁨
    매우 나쁨은 경우 : 매우 나쁨
    
    doubleday : 2일전 자세 평가
        
    아무런 데이터가 없으면 : none
        
    정상인 경우 : 정상
    주의인 경우 : 주의
    경고인 경우 : 경고
    나쁨인 경우 : 나쁨
    매우 나쁨은 경우 : 매우 나쁨
    
> response : fail

    status : 404
    
    message : user not found

> response : fail

    status : 404
    
    message : user neck data not found
