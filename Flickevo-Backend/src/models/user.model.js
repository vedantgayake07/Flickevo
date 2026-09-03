const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exist"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "email not valid"],
    },

    username: {
        type: String,
        unique: [true, "username already taken"],
        required: [true, "username is required"],
        trim : true
    },

    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password must be at least 8 characters long"],
        select: false//while accessing user document password will not be given
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const hash = await bcryptjs.hash(this.password, 10)
    this.password = hash

    return;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcryptjs.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;