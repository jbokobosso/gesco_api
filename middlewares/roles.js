const jwt = require("jsonwebtoken")
const config = require("config")
const bcrypt = require("bcrypt")

module.exports = function roles(req, res, suite) {

    // const queried_ressource = req.baseUrl.split("/")[2]

    if(!req.headers.authorization) return res.status(401).json("Auth token required")
    
    const token = req.headers.authorization.split(" ")[1]
    if(!token) return res.status(401).json("Auth token required")

    const decodedToken = jwt.verify(token, config.get("secret"))
    if(!decodedToken) return res.status(400).json("Token invalid or expired")

    let roles = [...decodedToken.roles]
    if(roles.find(item => item === "anonymous") !== undefined)
        return res.status(403).json("You have not the correct rights to access that ressource")

    req.user = decodedToken
    suite()
}