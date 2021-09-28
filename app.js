
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose")
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

const app= express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret:"My name is Aryan",
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/secretsDB")
const secretSchema=new mongoose.Schema({
  email:String,
  password:String
})
secretSchema.plugin(passportLocalMongoose)
// secretSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] })
const Secret= mongoose.model("Secret",secretSchema)
passport.use(Secret.createStrategy());

passport.serializeUser(Secret.serializeUser());
passport.deserializeUser(Secret.deserializeUser());

app.get("/",function(req,res){
  res.render("home");
})
app.get("/secrets",(req,res)=>{
  if(req.isAuthenticated())
  res.render("secrets");
  else {
   res.redirect("/login");
  }
})
app.get("/register",(req,res)=>{
  res.render("register")
})

app.post("/register",(req,res)=>{
  Secret.register({username:req.body.username},req.body.password,function(err,user){
    if(err)
    {
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets")
      })
    }
  })
  });

app.get("/login",(req,res)=>{
res.render("login");
})

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
})

app.post("/login",(req,res)=>{
  const user=new Secret({
    username:req.body.username,
    password:req.body.password
  })
  req.login(user,(err)=>{
    if(err)
    console.log(err);
    else {
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets")
    }
  )}
  })
})
app.listen(3000,()=>{
  console.log("port started at 3000");
})
