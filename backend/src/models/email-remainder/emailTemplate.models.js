import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
    customTemplate:{
        type:String,
        required:true
    },
},{ timestamps: true })

const  EmailTemplateModel = mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplateModel
