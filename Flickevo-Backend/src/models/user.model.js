const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        sparse: true,
        trim: true,
        lowercase: true,
        default: null
    },

    username: {
        type: String,
        unique: true,
        required: [true, "username is required"],
        trim: true,
        minLength: [3, "username must be at least 3 characters long"]
    },

    password: {
        type: String,
        required: [true, "password is required"],
        minLength: [8, "password must be at least 8 characters long"],
        select: false//while accessing user document password will not be given
    },

    profilePicture: {
        type: String,
        default: ""
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