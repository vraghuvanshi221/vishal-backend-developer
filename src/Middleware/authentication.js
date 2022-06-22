
const jwt = require('jsonwebtoken')
const isPresentToken = function (req, res, next) {

    if (!(req.headers["x-api-key"])) {
        res.send({ status: false, msg: "token must be present" })
    }
    else {

        next()
    }
}
const isVerifyToken = function (req, res, next) {
    let token = req.headers["x-api-key"]

    try {
        let decodedToken = jwt.verify(token, "project1");
        if (!decodedToken) {
            res.send({ status: false, msg: "token is invalid" });
        }
        next()
    } catch (err) {
        res.send({ status: false, msg: "token is invalid" });

    }

}









module.exports = { isPresentToken, isVerifyToken }