const mongoose=require('mongoose')

const bookSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdat:{
        type:Date,
        default:Date.now
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
    
})
 const bookmodel=mongoose.model('Book',bookSchema);
 module.exports= bookmodel