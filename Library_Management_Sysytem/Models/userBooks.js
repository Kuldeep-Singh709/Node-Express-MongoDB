const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");


const userBookShema = new mongoose.Schema({

    title : {

        type: String,
        required: true,
        unique: true, 
        // index: true,
    },
    // identifier : {
    //     type : Number,
    //     require : true,
    //     unique: true,

    // },
    // categories : {}

});


// Define a method to verify the password
userBookShema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  userBookShema.plugin(passportLocalMongoose);
  
  module.exports = mongoose.model("userBook", userBookShema);
