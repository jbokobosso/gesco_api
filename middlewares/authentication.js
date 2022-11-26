const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcrypt")
const lodash = require("lodash")

module.exports = function authentication(request, response, next) {
    try {
        if (!request.headers.authorization) return response.status(401).json({ message: "Auth token required in Bearer header" })

        const token = request.headers.authorization.split(" ")[1]
        if (!token) return response.status(401).json({ message: "Auth token required" })

        const decodedToken = jwt.verify(token, config.get("secret"))
        if (!decodedToken) return response.status(400).json({ message: "Token invalid or expired" })

        request.user = lodash.omit(decodedToken, ["password"])
    } catch (error) {
        if (error.name === "TokenExpiredError")
            response.status(401).json({ message: "Token expired" })
        else
            response.status(500).json({ message: `${error.toString()}\n token: ${request.headers.authorization}` })
    }
    next()
}