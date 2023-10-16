const multer = require("multer");
const axios = require("axios");
const middleware = {};

const rateLimit = require("express-rate-limit");

middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in first");
  res.send("You Are Not Allowed..Sorry");
};

middleware.isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect("/");
};

middleware.isvalidate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login"); // Redirect to login page if not authenticated
};

middleware.upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});



middleware.booksFullinfo = async (req, res, next) => {

  try{

    const response = await axios.get("https://mocki.io/v1/fd68d1cd-1970-4be8-b79d-6e4fe5d2fde2");
    req.fullBookData = response;
    next();

  }catch(error){
    console.error("Error fetching book data (Check Your booksFullinfo Middleware):", error);
    res.status(500).json({ error: "An error occurred while fetching book data." });
    }
}
   
  

// Route for fetching book data
middleware.fetchBooks = async (req, res, next) => {
 try {
  
   const response = await axios.get("https://mocki.io/v1/fd68d1cd-1970-4be8-b79d-6e4fe5d2fde2");

  //  console.log("Books Data :",response)

 // Define the truncateTitle function at the beginning
  const truncateTitle = function (book, wordLimit) {
    const title =
      book.volumeInfo && book.volumeInfo.title
        ? book.volumeInfo.title
        : 'N/A';
    const words = title.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '....';
    }
    return title;
  };

  if (response.data && response.data.items) {
      var books = response.data.items.map((book) => ({
        title: truncateTitle(book, 10), // Truncate title to 10 words
      }));
    }
    req.booksData = books || []; // Extract the 'items' array from the API response
    req.fullBookData = response;
    next();
  } catch (error) {
    console.error("Error fetching book data (Check Your fetchBooks Middleware):", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching book data." });
  }
};


middleware.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Mai middleware.storage kai Ander huu");
    cb(null, "public/uploads"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    console.log("Mai middleware.storage kai filenmae Ander huu");
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});


middleware.upload = multer({
  storage: middleware.storage, // Use the middleware.storage configuration
  limits: {
    fileSize: 4 * 1024 * 1024, // Limit the file size to 4MB
  },
});




// Define a rate limiter for the /loginPost route
middleware.loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 login requests per minute (adjust as needed)
});


module.exports = middleware;



// const response = await axios.get("https://www.googleapis.com/books/v1/volumes?q='reports',r='ghandi',s='asian'"); // Replace with your desired search query
   


//Three Middleware Are used Here (isLoggedIn,isAdmin,upload)
//req.isAuthenticated() is not a middlware it is Method of Passport js



// middleware.truncateTitle = function(title, wordLimit) {
//   const words = title ? title.split(' ') : [];
//   if (words.length > wordLimit) {
//     return words.slice(0, wordLimit).join(' ') + '...';
//   }
//   return title || 'N/A';
// };


// // truncateTitle.js
// function truncateTitle(book, wordLimit) {
//   const title = book.volumeInfo && book.volumeInfo.title ? book.volumeInfo.title : 'N/A';
//   const words = title.split(' ');
//   if (words.length > wordLimit) {
//     return words.slice(0, wordLimit).join(' ') + '...';
//   }
//   return title;
// }







