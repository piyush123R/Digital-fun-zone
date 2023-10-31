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

const Todo=mongoose.model('Todo',newSchema);

module.exports=Todo;