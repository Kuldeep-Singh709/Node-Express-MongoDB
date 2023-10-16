const Router = require("express");

const router = Router();

//importing Models
const User = require("../Models/User");
const Admin = require("../Models/Admin");
const Books = require("../Models/Books");

module.exports.loginpage=(req,res)=>{

    res.render("Login");
}
module.exports.signuppage=(req,res)=>{

    res.render("Signup");
}

