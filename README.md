# BorrowJeje API

## https://borrowjeje.herokuapp.com/users/signup
method: POST \
request_body_schema:
```
    {
      "phoneNo": String,
      "pin": String
    }
```
## https://borrowjeje.herokuapp.com/users/signin
method: POST \
request_body_schema:
```
    {
      "phoneNo": String,
      "pin": String
    }
```

## https://borrowjeje.herokuapp.com/users/user
method: GET \
request_header_param: (key=authorization, value=`token`)

## https://borrowjeje.herokuapp.com/users/user/details
method: GET \
request_header_param: (key=authorization, value=`token`)

### https://borrowjeje.herokuapp.com/users/user/details
method: POST \
request_body_schema:
```    
       {
            "details": {
                "firstName": String,
                "lastName": String,
                "middleName": String,
                "email": String,
                "gender": {
                    "male": Boolean,
                    "female": Boolean
                }, 
                "birthDate": {
                    "year": Number,
                    "month": Number,
                    "day": Number
                },
                "address": String,
                "bvn": String,
                "employmentStatus": {
                    "jobTitle": String
                }
            }
        }
```






## https://borrowjeje.herokuapp.com/superusers/signup
method: POST \
request_body_schema:
```
    {
      "username": String,
      "password": String
    }
```
## https://borrowjeje.herokuapp.com/superusers/signin
method: POST \
request_body_schema:
```
    {
      "username": String,
      "password": String
    }
```

## https://borrowjeje.herokuapp.com/superusers/superuser
method: GET \
request_header_param: (key=authorization, value=`token`)