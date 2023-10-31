const mongoose=require('mongoose')
const schema=mongoose.schema

const newSchema=({
     email:{
        type:String,
        required: true
     },
     score:{
        type:Number,
        required: true
     },
     count:{
        type:Number,
        required: true
     }
})

const Score=mongoose.model('Points',newSchema);

module.exports=Score;