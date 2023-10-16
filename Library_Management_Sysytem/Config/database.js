const mongoose = require("mongoose");

require("dotenv").config();

module.exports.connect = () => {
  // mongoose.connect(process.env.DB_URL, {
    
  mongoose.connect("mongodb://127.0.0.1:27017", { dbname:'Library_Management'},{
      useNewUrlParse: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DataBase Connect Successfully...");
    })
    .catch((error) => {
      console.log("There are Some Problem in DataBase Connection");
      console.log(error);
      process.exit(1);
    });
};


// mongoose.connect("mongodb://127.0.0.1:27017",{ dbname:'BackEnd_Second'}).then(()=>{console.log("DataBase Connected SuccessFully....")}).catch((error)=>{console.log("There are Some Problem in DataBase Connection")});