const jwt = require('jsonwebtoken')

module.exports = function (userId, req) {
    const token = req.headers.authorization.split(' ')[1]
    if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (decoded.id == userId) {
            return true
        } else return false
    } else return false
}