const mongoose=require('mongoose')
const schema=mongoose.schema

const newSchema=({
    userName:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})

const Message=mongoose.model('testmessage',newSchema)

module.exports=Message;