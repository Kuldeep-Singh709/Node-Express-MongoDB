const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
});

adminSchema.plugin(passportLocalMongoose);

exports.model = mongoose.model("Admin",adminSchema);