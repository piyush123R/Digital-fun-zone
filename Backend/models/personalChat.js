const mongoose=require('mongoose')
const schema=mongoose.Schema

const newSchema=({
    email:{
        type:String,
        required:true
    },
    pair:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required: true
    },
    date:{
        type:String,
        required:true
    }
})

const Chat=mongoose.model('presonalChat',newSchema)

module.exports=Chat;