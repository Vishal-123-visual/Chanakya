import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Accounts', 'Counsellor', 'Telecaller', 'Admin', "SuperAdmin"],
        required: true
    },
    api_token: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema)