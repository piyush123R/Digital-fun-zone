const mongoose=require('mongoose')
const schema=mongoose.schema;

const newSchema=({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
})

const Register=mongoose.model('Register',newSchema);

module.exports=Register;