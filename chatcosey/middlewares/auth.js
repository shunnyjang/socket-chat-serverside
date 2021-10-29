const jwt  = require('../modules/jwt');
const TOKEN_EXPIRED = -3
const TOKEN_INVALID = -2

module.exports = async (req, res, next) => {
    var token = req.headers.authorization;
        if (!token)
            return res.status(400).json({message: "토큰값이 없습니다."});
        const user = await jwt.verify(token);
        if (user === TOKEN_EXPIRED)
            return res.status(401).json({message: "만료된 토큰입니다."});
        if (user === TOKEN_INVALID)
            return res.status(401).json({message: "유효하지 않은 토큰입니다."});
        if (user === undefined)
            return res.status(401).json({message: "유효하지 않은 토큰입니다."});
        req.user = user;
        next();
};
