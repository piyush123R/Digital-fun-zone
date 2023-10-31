const mongoose=require('mongoose')
const schema=mongoose.schema

const newSchema=({
    email:{
        type:String,
        required: true
    },
    task:{
        type: String,
        required: true
    }
})

const Completed=mongoose.model('Done Todo',newSchema);

module.exports=Completed;