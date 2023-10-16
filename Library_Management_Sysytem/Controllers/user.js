const Router = require("express");
const router = Router();
const axios = require("axios");
const bcrypt = require("bcrypt");
//importing Models
const User = require("../Models/User");
const userBooks = require("../Models/userBooks");
const Admin = require("../Models/Admin");
const Books = require("../Models/Books");
const flash = require("express-flash");
const userRoutes = require("../Routes/user");
const middleware = require("../middlewares/middleware"); //importing Middleware
const CircularJSON = require('circular-json');

module.exports.loginpage = (req, res) => {
  res.render("Login");
};

module.exports.getSingleBook= (req,res) =>{
  

  const { bookData } = req.body;

  try {
      // Parse the JSON string back to an object
      const parsedBookData = JSON.parse(bookData);

      // Convert the object to a JSON string using CircularJSON
      const circularJSONData = CircularJSON.stringify(parsedBookData);

      // Render the bookCard.ejs template with the circularJSONData
      res.render("bookCard", { bookData: circularJSONData });
  } catch (error) {
      // Handle errors, such as invalid JSON, appropriately
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
  
  // const bookData = req.fullBookData;
  // return res.render("bookCard", { bookData: bookData }); 

  // const { response } = req.body;
  // const userId = req.user._id;
  // console.log("new Book Data", req.body);
  // console.log("new Book Data", response.Title);
  // res.render("bookCard");
} 

module.exports.signuppage = (req, res) => {
  res.render("Signup");
};

module.exports.signupSucessful = (req, res) => {
  req.flash("Register Successefully");
  res.render("Login");
};

module.exports.dashboard = async (req, res) => {
  const user_id = req.user._id;

  try {
    // Find a user by ID
    const foundUser = await User.findById(user_id);

    if (foundUser) {
      // User found
      console.log("You Are Inter into Actual Block");
      const books = req.booksData; // Access book data from req (only Tittle)
      const bookData = req.fullBookData; // Access Total book of data from req
      // console.log("Full book Data :::",bookData);

      return res.render("dashBoard", { books: books, bookData: bookData }); // Pass books to your EJS template
    }

    // User not found
    console.log("You Are Inter into Wrong Block");
    return res.render("Signup", {
      message: "User Not Exists. Please Do Sign Up",
    });
  } catch (err) {
    console.log("You Are Inter into Catch Block");
    console.error(err); // Log the error
    return res.render("Signup", {
      message: "An error occurred during Login. Please try again later.",
    });
  }
};

module.exports.userRegistration = async (req, res) => {
  const {
    username,
    email,
    password,
    gender,
    academicYear,
    studentClass,
    city,
    state,
  } = req.body;

  console.log(
    `Name: ${username}, Email: ${email}, Gender: ${gender}, academicYear: ${academicYear}, studentClass: ${studentClass}, city: ${city}, state: ${state}`
  );

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.render("Signup", {
          message: "Username already exists. Please choose another username.",
        });
      } else {
        return res.render("Signup", {
          message: "Email is already used. Please choose another email.",
        });
      }
    }

    // If the username and email are unique, create a new user
    const saltRounds = 2;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword, // Use the hashed password
      gender: gender,
      academicYear: academicYear,
      studentClass: studentClass,
      city: city,
      state: state,
    });

    await newUser.save();

    req.flash("successMessage", "Registration successful! You can now log in.");
    console.log(`Name: ${username}, Email: ${email}, Gender: ${gender}`);
    res.render("Login");
  } catch (err) {
    console.error(err); // Log the error
    return res.render("Signup", {
      message: "An error occurred during registration. Please try again later.",
    });
  }
};

module.exports.uploadProfilePicture = async (req, res) => {
  console.log("Mai uploadProfilePicture aki Ander huu");

  // Check if a file was uploaded
  if (!req.file) {
    // Handle the case where no file was uploaded
    return res.status(400).json({ error: "No file uploaded." });
  }
  // The uploaded file can be accessed as req.file
  const uploadedFile = req.file;
  const userId = req.user._id;
  console.log("Enter into Upload profile picture");
  // try {
  // Assuming you have access to the user's ID (userId)
  const updatedUser = await User.findByIdAndUpdate(userId, {
    profilePicture: uploadedFile.filename,
  }); // Update the user's profile picture field

  console.log("profile picture Succesfully uplaod ho chuki hai");

  if (updatedUser.userId) {
    return res.status(500).json({ error: "Failed to update profile picture." });
  } else {
    res.redirect("/user/profile"); // Redirect to the user's profile page
  }
};

module.exports.getUserLogout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
    }
    res.redirect("/loginpage");
    console.log("User SuccessFully Logout");
  });
};

module.exports.getUserProfile = async (req, res) => {
  const user_id = req.user._id;

  try {
    // Find a user by ID
    var foundUser = await User.findById(user_id);
  } catch (err) {
    console.error(err);
  }

  // Retrieve the issued books from the user's session
  // const issuedBooks = (await req.session.issuedBooks) || [];
  const issuedBooks = (await req.session.issuedBooks) || [];

  // Render the user profile page with the issuedBooks data
  res.render("user/Profile", { issuedBooks, foundUser });
};

module.exports.getArticles = async (req, res) => {
  const response = await axios.get(
    "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=76195bdbc5514003b407031872c35049"
  );
  console.log("List of Articles :", response);
  res.render("user/Articles", { articles: response });
};

module.exports.getReports = (req, res) => {
  res.render("user/Reports");
};

module.exports.getIssuedBook = async (req, res) => {
  const { bookTitle } = req.body;
  const userId = req.user._id;
  console.log("new Book Data", req.body);

  // Store the issued book's title in the user's session or cookies
  req.session.issuedBooks = req.session.issuedBooks || [];
  req.session.issuedBooks.push(bookTitle);

  try {
    // Check if the book with the same title already exists in userBooks collection
    const existingBook = await User.findOne({ "issuedBooks.Title": bookTitle });

    if (existingBook) {
      console.log("ThisBook already exists In the Database,");
      res.redirect("/dashboard");
    } else {
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { issuedBooks: { Title: bookTitle } } },
        // { $push: { issuedBooks: bookTitle } },
        { new: true } // Return the updated document
      );

      if (user) {
        console.log(
          `Book "${bookTitle}" issued successfully for user ${user.username}`
        );
        res.redirect("/dashboard");
      } else {
        // User not found, handle the error
        console.error("User not found");
        res.status(404).send("User not found");
      }
    }
  } catch (error) {
    // Handle other errors
    console.error("Error issuing book:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.getReturnBook = async(req,res) =>{

  const { bookTitle } = req.body;
  const userId = req.user._id; 

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { issuedBooks: { Title: bookTitle } } },
      { new: true }
    );

    if (updatedUser) {
      console.log('Book returned:', bookTitle);
    } else {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    res.redirect('/user/Profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }



 


  // const { bookTitle } = req.body;

  // const { bookTitle } = req.body;
  // const userId = req.user._id;

  // console.log("Book Tittle :",bookTitle);

  // try {
  //   // const bookId = req.params.id;
  //   const deletedBook = await User.findOneAndDelete({ "issuedBooks.Title": bookTitle });
    
  //   if (deletedBook) {
  //     console.log('Deleted Book:', deletedBook);
  //   } else {
  //     console.log('Book not found');
  //   }

  //   res.redirect("/user/Profile");
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send('Internal Server Error'); 
  // }
}



//     // Find the user by ID and update the issuedBooks array
//     const user = await User.findByIdAndUpdate(
//       userId,{ $push: { issuedBooks: { Title: bookTitle } } },
//       // { $push: { issuedBooks: bookTitle } },
//       { new: true } // Return the updated document
//     );
//  if (user) {
//       // Book issued successfully, you can handle the response as needed
//       console.log(`Book "${bookTitle}" issued successfully for user ${user.username}`);
//       res.redirect("/dashboard");
//     } else {
//       // User not found, handle the error
//       console.error("User not found");
//       res.status(404).send("User not found");
//     }
// } catch (error) {
//   // Handle other errors
//   console.error("Error issuing book:", error);
//   res.status(500).send("Internal Server Error");
// }

// const BookData =await new userBooks({title : bookTitle,},{ new: true });
//   await BookData.save();
// console.log("Book Database mai Succesfully Enter ho chuki hai",BookData);
// // Redirect the user back to the dashboard
// res.redirect("/dashboard");

// };

// const User = require("../models/userschema"); // Import your Mongoose model

// module.exports.getIssuedBook = async (req, res) => {
//   const { bookTitle } = req.body;
//   const userId = req.user._id;

//   try {
//     // Find the user by ID and update the issuedBooks array
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $push: { issuedBooks: bookTitle } },
//       { new: true } // Return the updated document
//     );

//     if (user) {
//       // Book issued successfully, you can handle the response as needed
//       console.log(`Book "${bookTitle}" issued successfully for user ${user.username}`);
//       res.redirect("/dashboard");
//     } else {
//       // User not found, handle the error
//       console.error("User not found");
//       res.status(404).send("User not found");
//     }
//   } catch (error) {
//     // Handle other errors
//     console.error("Error issuing book:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const newUser = new User({
//   username: username,
//   email: email,
//   password: hashedPassword, // Use the hashed password
//   gender: gender,
//   academicYear: academicYear,
//   studentClass: studentClass,
//   city: city,
//   state: state,
// });

// const foundUser = await User.findById(user_id);

// // Logout route
// router.get('/logout', (req, res) => {
//   req.logout(); // Log the user out (clear the session)
//   res.redirect('/login'); // Redirect the user to the login page or any other desired page
// });

// Save the file information to the user's profile
// User.findByIdAndUpdate(userId,{ profilePicture: req.file.filename },(err, user) => {
//     // const foundUser = await User.findByIdAndUpdate(userId, { profilePicture: req.file.filename }, (err, user) => {
//     if (err) {
//       console.error(err);
//       res.redirect("/profile?upload=failed");
//     } else {
//       res.redirect("/profile?upload=success");
//     }
//   }
// );

// async(req, res) => {
// const userId = req.user._id;

// // Save the file information to the user's profile
//     User.findByIdAndUpdate(userId, { profilePicture: req.file.filename }, (err, user) => {
// // const foundUser = await User.findByIdAndUpdate(userId, { profilePicture: req.file.filename }, (err, user) => {
//   if (err) {
//     console.error(err);
//     res.redirect("/profile?upload=failed");
//   } else {
//     res.redirect("/profile?upload=success");
//   }
// });
// });

//     (err, updatedUser) => {
//       if (err) {// Handle the error
//         return res.status(500).json({ error: "Failed to update profile picture." });
//       }
// // Success: Redirect or send a response indicating success
//       return res.redirect("/user/profile"); // Redirect to the user's profile page
//     }
//   );

//   const userId = req.user._id;
// console.log("Enter into Upload profile picture");
//   try {
//     // Update the user's profile picture
//     await User.findByIdAndUpdate(userId, { profilePicture: req.file.filename });
//     console.log("user ko find kar liya gaya hai");

//     // Redirect upon successful update
//     res.redirect('/profile?upload=success');

//   } catch (err) {
//     console.error(err);
//     res.redirect('/profile?upload=failed');
//   }

// };

// const userBooks = require("../Models/userBooks");

// module.exports.getIssuedBook = async (req, res) => {
//     const { bookTitle } = req.body;
//     const userId = req.user._id;

//     console.log("new Book Data", req.body);

//     // Check if the book with the same title already exists in userBooks collection
//     const existingBook = await userBooks.findOne({ title: bookTitle });

//     if (existingBook) {
//         // Update the existing book record
//         // Handle the update logic here
//         console.log("Book already exists, handle update logic here");
//     } else {
//         // Insert a new book record
//         const newBook = new userBooks({ title: bookTitle });
//         await newBook.save();
//         console.log("Book Database mai Succesfully Enter ho chuki hai", newBook);
//     }

//     // Redirect the user back to the dashboard
//     res.redirect("/dashboard");
// };

// try {
//     // Find the user by ID and update the issuedBooks array
//     const user = await User.findByIdAndUpdate(
//       userId,{ $push: { issuedBooks: { Title: bookTitle } } },
//       // { $push: { issuedBooks: bookTitle } },
//       { new: true } // Return the updated document
//     );
//  if (user) {
//       // Book issued successfully, you can handle the response as needed
//       console.log(`Book "${bookTitle}" issued successfully for user ${user.username}`);
//       res.redirect("/dashboard");
//     } else {
//       // User not found, handle the error
//       console.error("User not found");
//       res.status(404).send("User not found");
//     }
//   } catch (error) {
//     // Handle other errors
//     console.error("Error issuing book:", error);
//     res.status(500).send("Internal Server Error");
//   }

//     // Check if the book with the same title already exists in userBooks collection
//     const existingBook = await User.findOne({ 'issuedBooks.Title': bookTitle });

//     if (existingBook) {
//
//         console.log("ThisBook already exists In the Database,");
//     } else {
//         // Insert a new book record
//         const newBook = new userBooks({ title: bookTitle });
//         await newBook.save();
//         console.log("Book Database mai Succesfully Enter ho chuki hai", newBook);
//     }
