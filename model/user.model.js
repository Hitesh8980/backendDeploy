const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["CREATOR","VIEWALL","VIEWER"],
        required:true

    }
})
 const Usermodel=mongoose.model('User',userSchema);
 module.exports=Usermodel