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
    
    sex : 유저 성별햣
    
    work : 유저 직업
    
    
> response : Success

    status : 200
    
    
> response : Fail
    
    status : 404
    
    message : user not found
    
