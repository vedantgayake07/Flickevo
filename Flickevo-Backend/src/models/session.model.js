const mongoose = require("mongoose")

const sessionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "user",
        required : [true , "user is required"]
    },

    refreshTokenHash : {
        type : String ,
        required : [true , "refresh token is required"]
    },

    ip : {
        type : String ,
        required : [true , "ip is required"]
    },

    userAgent : {
        type : String ,
        required : [true , "user agent is required"] //browser  
    },

    revoked : {
        type : Boolean ,
        default : false //if true the refresh token becomes invalid we cant use it again to create access token
    }
} , {timestamps : true})

const sessionModel = mongoose.model("session" , sessionSchema)

module.exports = sessionModel;