const jwt = require('jsonwebtoken');

const createAccessJWT = (payload) => {
    const accessJWT = jwt.sign({payload}, process.env.ACCESS_SECRET_TOKEN,{expiresIn: "30m"});
    return Promise.resolve(accessJWT)
}

const createRefreshJWT = (payload) => {
    const refreshJWT = jwt.sign({payload}, process.env.REFRESH_SECRET_TOKEN, {expiresIn: "7d"});
    return Promise.resolve(refreshJWT)
}

module.exports = {
    createAccessJWT,
    createRefreshJWT
}