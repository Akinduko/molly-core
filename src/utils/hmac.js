/* jshint node: true */

'use strict';

var bufferEq = require('buffer-equal-constant-time');
var crypto = require('crypto');
var url = require('url');

module.exports = HmacAuth;
HmacAuth.AuthenticationError = AuthenticationError;

function HmacAuth(digestName, key, signatureHeader, headers) {
    this.digestName = digestName.toLowerCase();
    try {
        crypto.createHash(digestName);
    } catch (_) {
        throw new Error(
            'HMAC authentication digest is not supported: ' + digestName);
    }

    this.key = key;
    this.signatureHeader = signatureHeader.toLowerCase();
    this.headers = headers.map(function (h) { return h.toLowerCase(); });
}

HmacAuth.NO_SIGNATURE = 1;
HmacAuth.INVALID_FORMAT = 2;
HmacAuth.UNSUPPORTED_ALGORITHM = 3;
HmacAuth.MATCH = 4;
HmacAuth.MISMATCH = 5;

var resultStrings = [
    'NO_SIGNATURE',
    'INVALID_FORMAT',
    'UNSUPPORTED_ALGORITHM',
    'MATCH',
    'MISMATCH'
];

HmacAuth.resultCodeToString = function (code) {
    return resultStrings[code - 1];
};

function signedHeaders(req, headers) {
    return headers.map(function (header) {
        var value = req.headers[header];
        if (Array.isArray(value)) { value = value.join(','); }
        return value || '';
    });
}

HmacAuth.prototype.stringToSign = function (req) {
    var parsedUrl = url.parse(req.url);
    var hashUrl = unescape(parsedUrl.path + (parsedUrl.hash || ''));

    const data = [
        req.method, this.headers ? signedHeaders(req, this.headers).join('\n') : '', hashUrl
    ].join('\n') + '\n';

    return data
};

HmacAuth.prototype.signRequest = function (req, rawBody) {
    req.headers[this.signatureHeader] = this.requestSignature(req, rawBody);
};

HmacAuth.prototype.requestSignature = function (req, rawBody) {
    return requestSignature(this, req, rawBody, this.digestName);
};

function requestSignature(auth, req, rawBody, digestName) {
    var hmac = crypto.createHmac(digestName, auth.key);
    const reqData = auth.stringToSign(req)
    hmac.update(reqData);
    hmac.update(rawBody ? rawBody.toString('utf-8') : '');
    // console.log(reqData)
    // console.log(rawBody.toString('utf-8'))
    return hmac.digest('base64');
}

HmacAuth.prototype.signData = function (data) {
    var hmac = crypto.createHmac(this.digestName, this.key);
    hmac.update(data);
    return hmac.digest('base64');
}

HmacAuth.prototype.signatureFromHeader = function (req) {
    return req.headers[this.signatureHeader];
};

// Replace bufferEq() once https://github.com/nodejs/node/issues/3043 is
// resolved and the standard library implementation is available.
function compareSignatures(lhs, rhs) {
    var lbuf = new Buffer(lhs);
    var rbuf = new Buffer(rhs);
    return bufferEq(lbuf, rbuf) ? HmacAuth.MATCH : HmacAuth.MISMATCH;
}

HmacAuth.prototype.authenticateRequest = function (req, rawBody) {
    var header = this.signatureFromHeader(req);
    if (!header) { return [HmacAuth.NO_SIGNATURE]; }
    var components = header.split(' ');
    if (components.length !== 2) { return [HmacAuth.INVALID_FORMAT, header]; }
    var digestName = this.digestName
    var computed = requestSignature(this, req, rawBody, digestName);
    // console.log(components[1])
    return [compareSignatures(components[1], computed), header, computed];
};

HmacAuth.prototype.verifyData = function (data, signature) {
    var computed = this.signData(data)
    return compareSignatures(signature, computed);
};

function AuthenticationError(signatureHeader, result, header, computed) {
    this.name = 'AuthenticationError';
    this.signatureHeader = signatureHeader;
    this.result = result;
    this.header = header;
    this.computed = computed;
    this.message = signatureHeader + ' authentication failed: ' +
        HmacAuth.resultCodeToString(result);
    if (header) { this.message += ' header: "' + header + '"'; }
    if (computed) { this.message += ' computed: "' + computed + '"'; }
    this.stack = (new Error()).stack;
}
AuthenticationError.prototype = Object.create(Error.prototype);
AuthenticationError.prototype.constructor = AuthenticationError;
