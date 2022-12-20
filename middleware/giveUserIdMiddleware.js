const jwt = require('jsonwebtoken')

module.exports = function (req) {
    if (!req.headers.authorization) {
        return false
    }
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    return decoded.id
}