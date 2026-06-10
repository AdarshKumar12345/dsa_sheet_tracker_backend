import mongoose from 'mongoose';
import Question from './Question.js';


const sheetSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title:{
        type:String,
        required:true,
    },
    fileName:{
        type:String,
    },
    fileUrl:{
        type:String,
    },
    totalQuestions:{
        type:Number,
        default:0,
    },
    questions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        }
    ],

},{
    timestamps:true,
})


export default mongoose.model("Sheet" , sheetSchema);


