const mongoose = require("mongoose");
const userschema = new mongoose.Schema({
    image :{
        name : {    
            type :String,
        },
        path :{
            type:String
        }
    }
});


const User = mongoose.model("yo",userschema);
module.exports = User;