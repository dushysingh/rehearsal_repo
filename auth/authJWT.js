// const express = require('express');
// const router = express.Router();
// const middleware = require('../middleware/userMiddleware');
// const loginController = require('../controllers/login/loginController');
// const responseCode = require("../common/responseCode");

// /* POST login. */
// router.post('/', async (req, res, next) => {
//   if (req.body.email && req.body.password) {

//     var admin = await loginController.login(req, res);

//     if (admin) {
//       try {
//         let token = await middleware.createJwtToken(admin)
//         responseCode.CustomResponse(res,200,{ token: token });
//       }
//       catch (e) {
//         console.error('error token', e);
//         responseCode.CustomResponse(res,111,{ error: e });
//       }
//     }
//   }
 
// });

// module.exports = router;
