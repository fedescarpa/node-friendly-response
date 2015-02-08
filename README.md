# node-friendly-response

## How can I use it?...

### It's very simple

##### Install it running...

```sh
npm install --save node-friendly-response
```

##### Require it as a node module...

```js

var express  = require('express');
var Response = require('node-friendly-response');

var app = express();

app.get('/', function (req, res) {
  res.OK({ message: 'Hello World!' })
});

```

## Using it with Bluebird

```js

var express  = require('express');
var Bluebird = require('bluebird');
var Response = require('node-friendly-response');

var app = express();

app.get('/', function (req, res) {
  Bluebird.resolve({ message: 'Hello World!' })
    .tap(__doSomething)
    .then(function (data) {
      res.OK(data);
    })
    .catch(function (err) {
      res.INTERNAL_SERVER_ERROR(err);
    });
});

```

## Express response errors handle

```js

var express  = require('express');
var Bluebird = require('bluebird');
var Response = require('node-friendly-response');


var app = express();

app.get('/', function (req, res) {
  var ResponseError = res.Error;
  Bluebird.resolve( req.body )
    .tap(function (body) {
      if (!body.value) {
        throw new ResponseError.BAD_REQUEST('Property "value" is mandatory');
      }
    })
    .get('value')
    .tap(function (value) {
      if (value !== 42) {
        throw new ResponseError.PAYMENT_REQUIRED('$$$$');
      }
    })
    .then(__doSomething)
    .then(res.OK.bind(res))
    .catch(ResponseError, res.sendError.bind(res));
});

```

## Available Status Codes

```js
res.CONTINUE  // send a response with status 100
res.SWITCHING_PROTOCOLS  // send a response with status 101
res.PROCESSING  // send a response with status 102

res.OK  // send a response with status 200
res.CREATED  // send a response with status 201
res.ACCEPTED  // send a response with status 202
res.NON_AUTHORITATIVE_INFORMATION  // send a response with status 203
res.NO_CONTENT  // send a response with status 204
res.RESET_CONTENT  // send a response with status 205
res.PARTIAL_CONTENT  // send a response with status 206
res.MULTI_STATUS  // send a response with status 207

res.MULTIPLE_CHOICES  // send a response with status 300
res.MOVED_PERMANENTLY  // send a response with status 301
res.MOVED_TEMPORARILY  // send a response with status 302
res.SEE_OTHER  // send a response with status 303
res.NOT_MODIFIED  // send a response with status 304
res.USE_PROXY  // send a response with status 305
res.TEMPORARY_REDIRECT  // send a response with status 307

res.BAD_REQUEST  // send a response with status 400
res.UNAUTHORIZED  // send a response with status 401
res.PAYMENT_REQUIRED  // send a response with status 402
res.FORBIDDEN  // send a response with status 403
res.NOT_FOUND  // send a response with status 404
res.METHOD_NOT_ALLOWED  // send a response with status 405
res.NOT_ACCEPTABLE  // send a response with status 406
res.PROXY_AUTHENTICATION_REQUIRED  // send a response with status 407
res.REQUEST_TIMEOUT  // send a response with status 408
res.CONFLICT  // send a response with status 409
res.GONE  // send a response with status 410
res.LENGTH_REQUIRED  // send a response with status 411
res.PRECONDITION_FAILED  // send a response with status 412
res.REQUEST_TOO_LONG  // send a response with status 413
res.REQUEST_URI_TOO_LONG  // send a response with status 414
res.UNSUPPORTED_MEDIA_TYPE  // send a response with status 415
res.REQUESTED_RANGE_NOT_SATISFIABLE  // send a response with status 416
res.EXPECTATION_FAILED  // send a response with status 417
res.INSUFFICIENT_SPACE_ON_RESOURCE  // send a response with status 419
res.METHOD_FAILURE  // send a response with status 420
res.UNPROCESSABLE_ENTITY  // send a response with status 422
res.LOCKED  // send a response with status 423
res.FAILED_DEPENDENCY   // send a response with status 424

res.INTERNAL_SERVER_ERROR  // send a response with status 500
res.NOT_IMPLEMENTED  // send a response with status 501
res.BAD_GATEWAY  // send a response with status 502
res.SERVICE_UNAVAILABLE  // send a response with status 503
res.GATEWAY_TIMEOUT  // send a response with status 504
res.HTTP_VERSION_NOT_SUPPORTED  // send a response with status 505
res.INSUFFICIENT_STORAGE  // send a response with status 507
```

## Available Errors

```
res.Error = res.Error.INTERNAL_SERVER_ERROR

res.Error.BAD_REQUEST
res.Error.UNAUTHORIZED
res.Error.PAYMENT_REQUIRED
res.Error.FORBIDDEN
res.Error.NOT_FOUND
res.Error.METHOD_NOT_ALLOWED
res.Error.NOT_ACCEPTABLE
res.Error.PROXY_AUTHENTICATION_REQUIRED
res.Error.REQUEST_TIMEOUT
res.Error.CONFLICT
res.Error.GONE
res.Error.LENGTH_REQUIRED
res.Error.PRECONDITION_FAILED
res.Error.REQUEST_TOO_LONG
res.Error.REQUEST_URI_TOO_LONG
res.Error.UNSUPPORTED_MEDIA_TYPE
res.Error.REQUESTED_RANGE_NOT_SATISFIABLE
res.Error.EXPECTATION_FAILED
res.Error.INSUFFICIENT_SPACE_ON_RESOURCE
res.Error.METHOD_FAILURE
res.Error.UNPROCESSABLE_ENTITY
res.Error.LOCKED
res.Error.FAILED_DEPENDENCY

res.Error.INTERNAL_SERVER_ERROR
res.Error.NOT_IMPLEMENTED
res.Error.BAD_GATEWAY
res.Error.SERVICE_UNAVAILABLE
res.Error.GATEWAY_TIMEOUT
res.Error.HTTP_VERSION_NOT_SUPPORTED
res.Error.INSUFFICIENT_STORAGE
```

## It works with request module too

```js
var request = require('request');
var Response = require('node-friendly-response');

request('http://google.com', function (err, httpResponse, body) {
  if (httpResponse.isSuccess()) {
    __doSuccess();
  }
  if (httpResponse.isRedirect()) {
    __doRedirect();
  }
  if (httpResponse.isClientError()) {
    __doClientError();
  }
  if (httpResponse.isServerError()) {
    __doServerError();
  }
  if (httpResponse.isError()) {
    __doError();
  }
})
```

### This module provides...

```js
res.isInfo()  //  For status codes 1xx;
res.isSuccess()  //  For status codes 2xx;
res.isRedirect()  //  For status codes 3xx;
res.isClientError()  //  For status codes 4xx;
res.isServerError()  //  For status codes 5xx;
res.isError()  //  For status codes 4xx and 5xx;
```

### and also...

```js
res.isCONTINUE()  // if status code is 100
res.isSWITCHING_PROTOCOLS()  // if status code is 101
res.isPROCESSING()  // if status code is 102

res.isOK()  // if status code is 200
res.isCREATED()  // if status code is 201
res.isACCEPTED()  // if status code is 202
res.isNON_AUTHORITATIVE_INFORMATION()  // if status code is 203
res.isNO_CONTENT()  // if status code is 204
res.isRESET_CONTENT()  // if status code is 205
res.isPARTIAL_CONTENT()  // if status code is 206
res.isMULTI_STATUS()  // if status code is 207

res.isMULTIPLE_CHOICES()  // if status code is 300
res.isMOVED_PERMANENTLY()  // if status code is 301
res.isMOVED_TEMPORARILY()  // if status code is 302
res.isSEE_OTHER()  // if status code is 303
res.isNOT_MODIFIED()  // if status code is 304
res.isUSE_PROXY()  // if status code is 305
res.isTEMPORARY_REDIRECT()  // if status code is 307

res.isBAD_REQUEST()  // if status code is 400
res.isUNAUTHORIZED()  // if status code is 401
res.isPAYMENT_REQUIRED()  // if status code is 402
res.isFORBIDDEN()  // if status code is 403
res.isNOT_FOUND()  // if status code is 404
res.isMETHOD_NOT_ALLOWED()  // if status code is 405
res.isNOT_ACCEPTABLE()  // if status code is 406
res.isPROXY_AUTHENTICATION_REQUIRED()  // if status code is 407
res.isREQUEST_TIMEOUT()  // if status code is 408
res.isCONFLICT()  // if status code is 409
res.isGONE()  // if status code is 410
res.isLENGTH_REQUIRED()  // if status code is 411
res.isPRECONDITION_FAILED()  // if status code is 412
res.isREQUEST_TOO_LONG()  // if status code is 413
res.isREQUEST_URI_TOO_LONG()  // if status code is 414
res.isUNSUPPORTED_MEDIA_TYPE()  // if status code is 415
res.isREQUESTED_RANGE_NOT_SATISFIABLE()  // if status code is 416
res.isEXPECTATION_FAILED()  // if status code is 417
res.isINSUFFICIENT_SPACE_ON_RESOURCE()  // if status code is 419
res.isMETHOD_FAILURE()  // if status code is 420
res.isUNPROCESSABLE_ENTITY()  // if status code is 422
res.isLOCKED()  // if status code is 423
res.isFAILED_DEPENDENCY()  // if status code is 424

res.isINTERNAL_SERVER_ERROR()  // if status code is 500
res.isNOT_IMPLEMENTED()  // if status code is 501
res.isBAD_GATEWAY()  // if status code is 502
res.isSERVICE_UNAVAILABLE()  // if status code is 503
res.isGATEWAY_TIMEOUT()  // if status code is 504
res.isHTTP_VERSION_NOT_SUPPORTED()  // if status code is 505
res.isINSUFFICIENT_STORAGE()  // if status code is 507
```


## License

```
The MIT License (MIT)

Copyright (c) 2015 Federico Scarpa <fedescarpa@gmail.com>.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
