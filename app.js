const md5=require("md5")
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose")
// const encrypt=require("mongoose-encryption")
const app= express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/secretsDB")
const secretSchema=new mongoose.Schema({
  email:String,
  password:String
})

// secretSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] })
const Secret= mongoose.model("Secret",secretSchema)
app.get("/",function(req,res){
  res.render("home");
})
app.get("/register",(req,res)=>{
  res.render("register")
})
app.post("/register",(req,res)=>{

  const email=req.body.username;
  const password=req.body.password;
  const newSecret=new Secret({
    email:email,
    password:md5(password)
  })
  newSecret.save((err)=>{
    if(!err)
    res.render("secrets")
    else {
      redirect("/")
    };
  });

})
app.get("/login",(req,res)=>{
  res.render("login")
})
app.post("/login",(req,res)=>{
  const email=req.body.username;
  const password=req.body.password;
  Secret.findOne({email:email},(err,foundUser)=>{
    if(!err)
    {
      if(foundUser)
      {if(foundUser.password===md5(password))
      res.render("secrets");
      else
      res.redirect("/");
    }

    }
  })
})
app.listen(3000,()=>{
  console.log("port started at 3000");
})
