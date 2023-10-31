const mongoose=require('mongoose')
const schema=mongoose.schema;

const newSchema=({
    email:{
        type:String,
        required: true
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

const Message=mongoose.model('Messages',newSchema)

module.exports=Message;