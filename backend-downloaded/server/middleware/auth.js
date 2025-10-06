const fs = require("fs");
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync(`${appRoot}/server/security/jwtRS256.key.pub`);
const common = require('../util/common');
const constant = require('../util/constant');

module.exports.verifyAuthorization = async (request, response, next) => {
    if(request.headers && request.headers.authorization && request.headers.authorization.length > 0){
        jwt.verify(request.headers.authorization, publicKey, function(err, decoded) {
            if(err){
                console.log("Err------------------>", err)
                if(err.name && err.name === 'TokenExpiredError'){
                    return common.sendResponse(response, constant.requestMessages.ERR_EXPIRED_AUTH_TOKEN, false, 401)
                } else {
                    return common.sendResponse(response, constant.requestMessages.ERR_INVALID_AUTH_TOKEN, false, 401)
                }
            } else {
                console.log('decoded------------>', decoded);
                request.body.user_info = decoded;
                next();
            }
        });
    } else {
        return common.sendResponse(response, constant.requestMessages.ERR_AUTH_TOKEN_REQUIRED, false, 401)
    }
}