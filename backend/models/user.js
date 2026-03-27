import mongoose from "mongoose";

const UserSchema  = new mongoose.Schema({
    uid : { type : String , required : true , unique : true },
    email : { type : String, required : true , unique : true },
    password : { type : String },
    displayName :   String ,
    role : {type :String, enum :[ 'user', 'admin'] , default : 'user'},
    createdAt : {type : Date, default : Date.now() },
}, { toJSON : {virtuals : true }, toObjects : {virtuals : true }});

export const User = mongoose.model('User', UserSchema );