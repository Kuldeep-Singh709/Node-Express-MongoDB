const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema({

 
   username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    index: true,
  },

  gender: {
    type: String, 
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  studentClass: {
    type: String, 
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, 
  },
  issuedBooks: [{
    Title:{
      type:String,
    }
  }],


});

// Define a method to verify the password
userschema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userschema);


  // accountType: {
  //   type: String,
  //   enum: ["student", "admin", "instructor"],
  //   required: true,
  // },

  // phoneNumber: {
  //   type: Number,
  //   required: true,
  // },






