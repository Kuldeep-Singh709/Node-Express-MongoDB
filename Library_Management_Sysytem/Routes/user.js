const { Router } = require("express");
const router = Router();
const passport = require("passport");
const multer = require("multer");

// importing controller
const userController = require("../Controllers/user");

//importing Middleware
const middleware = require("../middlewares/middleware");
const upload = multer({ storage: middleware.storage });  // Create a Multer instance with the storage configuration

router.get("/signuppage", userController.signuppage);

router.get("/signupSucessful", userController.signupSucessful);

router.post("/register", userController.userRegistration);
router.get("/dashboard", middleware.isvalidate, middleware.fetchBooks, userController.dashboard);


router.get("/loginpage", userController.loginpage);

router.post(
  "/loginPost",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/signuppage",
    failureFlash: true, // Enable flash messages for failed login attempts
  })
);

router.post("/issueBook",userController.getIssuedBook);

router.post("/returnBook",userController.getReturnBook);

router.get("/userlogout",userController.getUserLogout);

router.get("/user/profile",userController.getUserProfile); 

// router.get("/bookCard", middleware.booksFullinfo, userController.getSingleBook); 
router.get("/bookCard", userController.getSingleBook); 

// Route to handle profile picture uploads
router.post("/upload-profile-picture", upload.single("profilePicture"), userController.uploadProfilePicture);

router.get("/dashboard/articles",userController.getArticles); 

router.get("/dashboard/reports",userController.getReports); 

module.exports = router;


// router.get("/", (req, res) => { res.sendFile(`${__dirname}/Public/cover.html`);});

// router.get("/dashboard", middleware.isvalidate, userController.dashboard);


// router.get("/deshboard",
//     middleware.isLoggedIn,
//     userController.deshboard
// );
// router.post("/deshboard",
// middleware.isLoggedIn,
// userController.deshboard
// );

// app.get('/dashboard', isAuthenticated, (req, res) => {
//     // Render the dashboard for authenticated users
//     res.render('dashBoard', { user: req.user });
// });




//    async(req, res) => {
//   const userId = req.user._id;

//   // Save the file information to the user's profile
//       User.findByIdAndUpdate(userId, { profilePicture: req.file.filename }, (err, user) => {
//   // const foundUser = await User.findByIdAndUpdate(userId, { profilePicture: req.file.filename }, (err, user) => {
//     if (err) {
//       console.error(err);
//       res.redirect("/profile?upload=failed");
//     } else {
//       res.redirect("/profile?upload=success");
//     }
//   });
// });
