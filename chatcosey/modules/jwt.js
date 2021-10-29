const jwt            = require('jsonwebtoken');
const secretKey = 'SeCrEt!Key';
const options = {
    algorithm: 'HS256',
    expiresIn: '30d',
    issuer: 'test-admin'
};
const refreshOptions = {
    algorithm: 'HS256',
    expiresIn: '7d',
    issuer: 'test-admin'
};
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2


module.exports = {
    sign: async (user) => {
        const payload = {
            id: user.id,
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            refreshToken: jwt.sign(payload, secretKey, refreshOptions)
        };
        return result;
    },
    verify: async (token) => {
        try {
            return jwt.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log('invalid token');
                console.log(err);
                return TOKEN_INVALID;
            }
        }
    },
    refresh: async (refreshToken) => {
        try {
            const result = jwt.verify(refreshToken, secretKey);
            if (result.member_no === undefined) {
                return TOKEN_INVALID;
            }
            const payload = {
                id: user.id,
            };
            const dto = {
                token: jwt.sign(payload, secretKey, options),
                refreshToken: jwt.sign(payload, secretKey, refreshOptions)
            };
            // TODO: Refresh User's token logic
            return dtd;
        } catch (err) {
            console.log('jwt.js ERROR : ', err);
            throw err;
        }
    }
};

