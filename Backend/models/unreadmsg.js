const mongoose=require('mongoose')
const schema=mongoose.schema;

const newSchema=({
    email:{
        type:String,
        required:true
    },
    readMsgCnt:{
        type:Number,
        required:true
    }
})

const msgCnt=mongoose.model('messageCnt',newSchema);

module.exports=msgCnt;


