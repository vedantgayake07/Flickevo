const userModel = require("../models/user.model")
const sessionModel = require("../models/session.model")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )

    return refreshToken
}

const generateAccessToken = (userId, sessionId) => {
    const accessToken = jwt.sign(
        {
            id: userId,
            sessionId // Helps us to know the session so we can take action
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    )
    return accessToken
}

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}


/**
 * Register user
 * POST /api/auth/register
 */
async function userRegisterController(req, res) {

    const { email, username, password } = req.body

    if (!email || !username || !password) {
        return res.status(400).json({
            message: "email, username and password are required"
        })
    }

    const isExist = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (isExist) {
        return res.status(409).json({
            message: "Email or username already exists"
        })
    }

    const user = await userModel.create({
        email,
        username,
        password
    })

    // Create refresh token
    const refreshToken = generateRefreshToken(user._id)

    // Hash refresh token
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")

    // Create session for particular device
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    // Create access token
    const accessToken = generateAccessToken(
        user._id,
        session._id
    )

    // Store refresh token in HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken)

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        },
        accessToken
    })
}


/**
 * Login user
 * POST /api/auth/login
 */
async function userLoginController(req, res) {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        })
    }

    const user = await userModel
        .findOne({ email })
        .select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is invalid"
        })
    }

    // Generate refresh token
    const refreshToken = generateRefreshToken(user._id)

    // Hash refresh token
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")

    // Create session
    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    // Access token contains session ID
    const accessToken = generateAccessToken(
        user._id,
        session._id
    )

    // Store refresh token in HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken)

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        },
        accessToken
    })
}


/**
 * Refresh access token
 * POST /api/auth/refresh
 */
async function refreshToken(req, res) {

    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(401).json({
            message: "Refresh token is required"
        })
    }

    try {

        // Verify refresh token
        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        )

        // Hash incoming refresh token
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

        // Find current session
        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        })

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }

        // Generate new refresh token
        const newRefreshToken = generateRefreshToken(decoded.id)

        // Hash new refresh token
        const newRefreshTokenHash = crypto
            .createHash("sha256")
            .update(newRefreshToken)
            .digest("hex")

        // Replace old hash
        session.refreshTokenHash = newRefreshTokenHash

        await session.save()

        // Generate new access token
        const accessToken = generateAccessToken(
            decoded.id,
            session._id
        )

        // Replace refresh token cookie
        setRefreshTokenCookie(res, newRefreshToken)

        return res.status(200).json({
            message: "Access token generated",
            accessToken
        })

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        })
    }
}


/**
 * Logout user
 * POST /api/auth/logout
 */
async function userLogoutController(req, res) {

    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    // Hash refresh token
    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    // Find current session
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(400).json({
            message: "Invalid refresh token"
        })
    }

    // Revoke session
    session.revoked = true

    await session.save()

    // Remove refresh token from cookie
    res.clearCookie("refreshToken")

    return res.status(200).json({
        message: "Logged out successfully"
    })
}


module.exports = {
    userRegisterController,
    userLoginController,
    refreshToken,
    userLogoutController
}