const mongoose=require('mongoose')
const schema=mongoose.schema

const newSchema=({
    fileName:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    }
})

const imgModel=mongoose.model('images',newSchema)

module.exports=imgModel


