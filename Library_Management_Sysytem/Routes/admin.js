// const { Router } = require("express");
// const router = Router();


// // importing controller
// const adminController =require("../Controllers/admin");
// //importing Middleware
// const middleware = require("../middlewares/middleware");

// router.get("/loginpage",
// middleware.isLoggedIn,
// adminController.loginpage    
// );
// router.get("/signuppage",
// middleware.isLoggedIn,
// adminController.signuppage
// );


// module.exports = router;

const { Router } = require("express");
const router = Router();


// importing controller
const adminController =require("../Controllers/admin");

//importing Middleware
const middleware = require("../middlewares/middleware");


router.get("/loginpage",
    middleware.isLoggedIn,
    adminController.loginpage
);
router.get("/signuppage",
    middleware.isLoggedIn,
    adminController.signuppage
);

router.get("/deshbord",
);

module.exports = router;

