const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const database = require("./Config/database");

const passportConfig = require("./passport-config"); // Import your passport-config.js file


// const User = require("./Models/userschema");

//impoting Models
const Admin = require("./Models/Admin");
const User = require("./Models/User");
//importing Routes
const userRoutes = require("./Routes/user");
const adminRoutes = require("./Routes/newAdmin");
const bookRoutes = require("./Routes/newBooks");

const app = express();
const PORT = 5000;

//Midelware's
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const flash = require("express-flash");
database.connect();

app.set("view engine", "ejs"); //View Engine

app.use(express.static("Public")); // Serve static files from the "public" folder



app.use(
  session({ secret: "samsungphone", resave: false, saveUninitialized: false })
);

app.use(passport.initialize()); // Initializing Passport
app.use(passport.session()); // Starting the session

// Pass your passport instance to the passport-config function
passportConfig(passport); // Call the function with your passport instance

app.use(flash());


app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/Public/cover.html`);
});

//Routes
app.use(userRoutes);
app.use(adminRoutes);
app.use(bookRoutes);
// app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Application is Running On Port Number : ${PORT} `);
});









// async function removeNullUsernames() {
//   try {
//     await User.deleteMany({ username: null });
//     console.log("Removed documents with null usernames.");
//   } catch (error) {
//     console.error("Error removing documents with null usernames:", error);
//   }
// }

  // Call the function before inserting new data
  // removeNullUsernames();



// const flash = require("connect-flash");
// const Router = require("./Routes/routerApi");
// const DataBase = require("./Config/database");
// const passportLocalMongoose = require("passport-local-mongoose");

// app.use(express.static("public"));

// require("dotenv").config();

// const PORT = process.env.PORT_NUM;
// const port = process.env.PORT || 3000;

// Node.js treats each file in a Node project as a module & The module object has an exports property.