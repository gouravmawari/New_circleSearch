const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const User = require("./model.js");
const path = require("path");

app.use(express.static(path.join(__dirname, "space")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const Storage = multer.diskStorage({
    destination:"space",
    filename(req,file,cb){
        cb(null,file.originalname);
    }
})
const upload = multer({
    storage:Storage
}).single("image");



function setExpiry(id){
 setTimeout(async ()=>{
    const result = await User.deleteOne(id)
    console.log(`${id} deleted`);
 }, 100000)   
}

app.post("/send",upload,async(req,res)=>{
    try{
        const user =new User({image:{name:req.file.filename,path :"/space/"}});
        await user.save();
        setExpiry(user._id)
       return  res.status(200).json({id:user._id})
    }   
    catch(err){
       return res.status(404).json(err);
    }
})



app.get("/receive",async(req,res)=>{
    const {ImageID} = req.query;
    try{
        console.log(ImageID);
        const user = await User.findById(ImageID)
        const fileName = user.image.name;
        const filePath = path.resolve(__dirname, 'space', fileName);
        app.use(express.static(path.join(__dirname, "space")));
        res.status(200).download(filePath)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
})


const dbURI =  "mongodb+srv://guddu:guddu@cluster1.ved7bni.mongodb.net/yes?retryWrites=true&w=majority";
mongoose.connect(dbURI ,{useNewUrlParser : true , useUnifiedTopology: true})
.then((result)=>{const PORT = process.env.PORT || 8888;
    app.listen(PORT,'0.0.0.0',()=>{
        console.log("server is created")
    })})
.catch((err)=>console.log(err))                     