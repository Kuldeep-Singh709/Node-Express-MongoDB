const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const bookschema = new mongoose.Schema({
  bookName: {
    type: String,
    require: true,
  },
  bookAuthor: {
    type: String,
    require: true,
  },
  ISBN: {
    type: String,
    require: true,
  },
  publisher: {
    type: String,
    require: true,
  },

  // bookStatus:{
  //     type:String,

  // },

  // bookState: "Available"
});


bookschema.plugin(passportLocalMongoose);

exports.model = mongoose.model("Book", bookschema);
