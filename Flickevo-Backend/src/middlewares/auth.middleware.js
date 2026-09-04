const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return res.status(400).json({
            message: "missing accessToken"
        })
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        console.log("decoded" ,decoded)

        const { id, sessionId } = decoded;

        req.user = { id, sessionId }

        next()
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Invalid or expired access token"
        })
    }
}

module.exports = { authMiddleware };