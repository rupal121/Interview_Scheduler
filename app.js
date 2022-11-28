//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const path = require('path');
const userRouter= require('./routes/userRoutes.js')
const interviewRouter= require('./routes/interviewRoutes.js')

const User= require('../intv_sch/models/user.js')
const Interviews= require('../intv_sch/models/interviews.js')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use('/users', userRouter)
app.use('/interviews', interviewRouter)

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/scaler-proj", {useNewUrlParser:true});

app.get("/",async(req, res)=>{
	const allUsers= await User.find({});
	res.render("create", {allUsers});
});


app.get("/view",async(req, res)=>{
	const allInterview= await Interviews.find({});
	
	res.render("home",{interviews:allInterview});
});

app.post("/update",async(req, res)=>{
	const allUsers= await User.find({});
	const interviewId=req.body.interviewId;
	res.render("update", {allUsers,interviewId});
});

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
