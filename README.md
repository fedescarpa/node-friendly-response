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
  res.ok({ message: 'Hello World!' })
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
      res.ok(data);
    })
    .catch(function (err) {
      res.internalServerError(err);
    });
});

```

## Express response errors handle

```js

var express  = require('express');
var Bluebird = require('bluebird');
var Response = require('node-friendly-response');

var ResponseError = Response.ResponseError;

var app = express();

app.get('/', function (req, res) {
  Bluebird.resolve( req.body )
    .tap(function (body) {
      if (!body.value) {
        throw new ResponseError.BadRequest('Property "value" is mandatory');
      }
    })
    .get('value')
    .tap(function (value) {
      if (value !== 42) {
        throw new ResponseError.PaymentRequired('$$$$');
      }
    })
    .then(__doSomething)
    .then(res.ok.bind(res))
    .catch(ResponseError, res.sendError.bind(res));
});

```

## Available Status Codes

```js
res.continue  // send a response with status 100
res.switchingProtocols  // send a response with status 101
res.processing  // send a response with status 102

res.ok  // send a response with status 200
res.created  // send a response with status 201
res.accepted  // send a response with status 202
res.nonAuthoritativeInformation  // send a response with status 203
res.noContent  // send a response with status 204
res.resetContent  // send a response with status 205
res.partialContent  // send a response with status 206
res.multiStatus  // send a response with status 207

res.multipleChoices  // send a response with status 300
res.movedPermanently  // send a response with status 301
res.movedTemporarily  // send a response with status 302
res.seeOther  // send a response with status 303
res.notModified  // send a response with status 304
res.useProxy  // send a response with status 305
res.temporaryRedirect  // send a response with status 307

res.badRequest  // send a response with status 400
res.unauthorized  // send a response with status 401
res.paymentRequired  // send a response with status 402
res.forbidden  // send a response with status 403
res.notFound  // send a response with status 404
res.methodNotAllowed  // send a response with status 405
res.notAcceptable  // send a response with status 406
res.proxyAuthenticationRequired  // send a response with status 407
res.requestTimeout  // send a response with status 408
res.conflict  // send a response with status 409
res.gone  // send a response with status 410
res.lengthRequired  // send a response with status 411
res.preconditionFailed  // send a response with status 412
res.requestTooLong  // send a response with status 413
res.requestUriTooLong  // send a response with status 414
res.unsupportedMediaType  // send a response with status 415
res.requestedRangeNotSatisfiable  // send a response with status 416
res.expectationFailed  // send a response with status 417
res.insufficientSpaceOnResource  // send a response with status 419
res.methodFailure  // send a response with status 420
res.unprocessableEntity  // send a response with status 422
res.locked  // send a response with status 423
res.failedDependency   // send a response with status 424

res.internalServerError  // send a response with status 500
res.notImplemented  // send a response with status 501
res.badGateway  // send a response with status 502
res.serviceUnavailable  // send a response with status 503
res.gatewayTimeout  // send a response with status 504
res.httpVersionNotSupported  // send a response with status 505
res.insufficientStorage  // send a response with status 507
```

## Available Errors

```
ResponseError = ResponseError.InternalServerError

ResponseError.BadRequest
ResponseError.Unauthorized
ResponseError.PaymentRequired
ResponseError.Forbidden
ResponseError.NotFound
ResponseError.MethodNotAllowed
ResponseError.NotAcceptable
ResponseError.ProxyAuthenticationRequired
ResponseError.RequestTimeout
ResponseError.Conflict
ResponseError.Gone
ResponseError.LengthRequired
ResponseError.PreconditionFailed
ResponseError.RequestTooLong
ResponseError.RequestUriTooLong
ResponseError.UnsupportedMediaType
ResponseError.RequestedRangeNotSatisfiable
ResponseError.ExpectationFailed
ResponseError.InsufficientSpaceOnResource
ResponseError.MethodFailure
ResponseError.UnprocessableEntity
ResponseError.Locked
ResponseError.FailedDependency

ResponseError.InternalServerError
ResponseError.NotImplemented
ResponseError.BadGateway
ResponseError.ServiceUnavailable
ResponseError.GatewayTimeout
ResponseError.HttpVersionNotSupported
ResponseError.InsufficientStorage
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
res.isContinue()  // if status code is 100
res.isSwitchingProtocols()  // if status code is 101
res.isProcessing()  // if status code is 102

res.isOk()  // if status code is 200
res.isCreated()  // if status code is 201
res.isAccepted()  // if status code is 202
res.isNonAuthoritativeInformation()  // if status code is 203
res.isNoContent()  // if status code is 204
res.isResetContent()  // if status code is 205
res.isPartialContent()  // if status code is 206
res.isMultiStatus()  // if status code is 207

res.isMultipleChoices()  // if status code is 300
res.isMovedPermanently()  // if status code is 301
res.isMovedTemporarily()  // if status code is 302
res.isSeeOther()  // if status code is 303
res.isNotModified()  // if status code is 304
res.isUseProxy()  // if status code is 305
res.isTemporaryRedirect()  // if status code is 307

res.isBadRequest()  // if status code is 400
res.isUnauthorized()  // if status code is 401
res.isPaymentRequired()  // if status code is 402
res.isForbidden()  // if status code is 403
res.isNotFound()  // if status code is 404
res.isMethodNotAllowed()  // if status code is 405
res.isNotAcceptable()  // if status code is 406
res.isProxyAuthenticationRequired()  // if status code is 407
res.isRequestTimeout()  // if status code is 408
res.isConflict()  // if status code is 409
res.isGone()  // if status code is 410
res.isLengthRequired()  // if status code is 411
res.isPreconditionFailed()  // if status code is 412
res.isRequestTooLong()  // if status code is 413
res.isRequestUriTooLong()  // if status code is 414
res.isUnsupportedMediaType()  // if status code is 415
res.isRequestedRangeNotSatisfiable()  // if status code is 416
res.isExpectationFailed()  // if status code is 417
res.isInsufficientSpaceOnResource()  // if status code is 419
res.isMethodFailure()  // if status code is 420
res.isUnprocessableEntity()  // if status code is 422
res.isLocked()  // if status code is 423
res.isFailedDependency()  // if status code is 424

res.isInternalServerError()  // if status code is 500
res.isNotImplemented()  // if status code is 501
res.isBadGateway()  // if status code is 502
res.isServiceUnavailable()  // if status code is 503
res.isGatewayTimeout()  // if status code is 504
res.isHttpVersionNotSupported()  // if status code is 505
res.isInsufficientStorage()  // if status code is 507
```

### and also... listeners for events...

```js

var ServerResponse = require('node-friendly-response').ServerResponse;

ServerResponse.onContinue(callback)  // if status code is 100
ServerResponse.onSwitchingProtocols(callback)  // if status code is 101
ServerResponse.onProcessing(callback)  // if status code is 102

ServerResponse.onOk(callback)  // if status code is 200
ServerResponse.onCreated(callback)  // if status code is 201
ServerResponse.onAccepted(callback)  // if status code is 202
ServerResponse.onNonAuthoritativeInformation(callback)  // if status code is 203
ServerResponse.onNoContent(callback)  // if status code is 204
ServerResponse.onResetContent(callback)  // if status code is 205
ServerResponse.onPartialContent(callback)  // if status code is 206
ServerResponse.onMultiStatus(callback)  // if status code is 207

ServerResponse.onMultipleChoices(callback)  // if status code is 300
ServerResponse.onMovedPermanently(callback)  // if status code is 301
ServerResponse.onMovedTemporarily(callback)  // if status code is 302
ServerResponse.onSeeOther(callback)  // if status code is 303
ServerResponse.onNotModified(callback)  // if status code is 304
ServerResponse.onUseProxy(callback)  // if status code is 305
ServerResponse.onTemporaryRedirect(callback)  // if status code is 307

ServerResponse.onBadRequest(callback)  // if status code is 400
ServerResponse.onUnauthorized(callback)  // if status code is 401
ServerResponse.onPaymentRequired(callback)  // if status code is 402
ServerResponse.onForbidden(callback)  // if status code is 403
ServerResponse.onNotFound(callback)  // if status code is 404
ServerResponse.onMethodNotAllowed(callback)  // if status code is 405
ServerResponse.onNotAcceptable(callback)  // if status code is 406
ServerResponse.onProxyAuthenticationRequired(callback)  // if status code is 407
ServerResponse.onRequestTimeout(callback)  // if status code is 408
ServerResponse.onConflict(callback)  // if status code is 409
ServerResponse.onGone(callback)  // if status code is 410
ServerResponse.onLengthRequired(callback)  // if status code is 411
ServerResponse.onPreconditionFailed(callback)  // if status code is 412
ServerResponse.onRequestTooLong(callback)  // if status code is 413
ServerResponse.onRequestUriTooLong(callback)  // if status code is 414
ServerResponse.onUnsupportedMediaType(callback)  // if status code is 415
ServerResponse.onRequestedRangeNotSatisfiable(callback)  // if status code is 416
ServerResponse.onExpectationFailed(callback)  // if status code is 417
ServerResponse.onInsufficientSpaceOnResource(callback)  // if status code is 419
ServerResponse.onMethodFailure(callback)  // if status code is 420
ServerResponse.onUnprocessableEntity(callback)  // if status code is 422
ServerResponse.onLocked(callback)  // if status code is 423
ServerResponse.onFailedDependency(callback)  // if status code is 424

ServerResponse.onInternalServerError(callback)  // if status code is 500
ServerResponse.onNotImplemented(callback)  // if status code is 501
ServerResponse.onBadGateway(callback)  // if status code is 502
ServerResponse.onServiceUnavailable(callback)  // if status code is 503
ServerResponse.onGatewayTimeout(callback)  // if status code is 504
ServerResponse.onHttpVersionNotSupported(callback)  // if status code is 505
ServerResponse.onInsufficientStorage(callback)  // if status code is 507
```

### and also... listeners for error events...

```js

ServerResponse.onResponseError(callback); // if status code greather than 400
ServerResponse.removeAllListeners(events); // remove all listeners for an event, the events is an array of status codes or the string 'response_error'

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
