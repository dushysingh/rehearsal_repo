/**
 *Updated by : Dushyant
 *Purpose : Router instance
 */

const express = require('express');
const router = express.Router();
//const { check, oneOf, validationResult } = require('express-validator');

//const UploadFileController = require('../controllers/uploadFile/uploadFileController');
//const custom = require('../middleware/custom');

const passport = require('passport');
const path = require('path');

//const MailConfig = require('../config/email');
// const hbs = require('nodemailer-express-handlebars');
// const gmailTransport = MailConfig.GmailTransport;

// // email template
// router.get('/email/template', (req, res, next) => {
//   MailConfig.ViewOption(gmailTransport,hbs);
//   let HelperOptions = {
//     from: '"Algoworks" <algoworks@gmail.com>',
//     to: 'dushyant.sengar@algoworks.com',
//     subject: 'Hellow world!',
//     template: 'test',
//     context: {
//       name:"algoworks",
//       email: "algoworks@gmail.com",
//       address: "52, Mumbai"
//     }
//   };
//   gmailTransport.sendMail(HelperOptions, (error,info) => {
//     if(error) {
//       console.log(error);
//       res.json(error);
//     }
//     console.log("email is send");
//     console.log(info);
//     res.json(info)
//   });
// });

// // email smtp configured template
// router.get('/email/smtp/template', (req, res, next) => {
//     MailConfig.ViewOption(smtpTransport,hbs);
//     let HelperOptions = {
//       from: '"Tariqul islam" <tariqul@falconfitbd.com>',
//       to: 'tariqul.islam.rony@gmail.com',
//       subject: 'Hellow world!',
//       template: 'test',
//       context: {
//         name:"tariqul_islam",
//         email: "tariqul.islam.rony@gmail.com",
//         address: "52, Kadamtola Shubag dhaka"
//       }
//     };
//     smtpTransport.verify((error, success) => {
//         if(error) {
//           res.json({output: 'error', message: error})
//           res.end();
//         } else {
//           smtpTransport.sendMail(HelperOptions, (error,info) => {
//             if(error) {
//               res.json({output: 'error', message: error})
//             }
//             res.json({output: 'success', message: info});
//             res.end();
//           });
//         }
//     })
    
//   });

router.use("/users", require("./user.routes"));
router.use("/organisations", require("./organisation.routes"));
router.use("/admin", require("./admin.routes"));

module.exports = router;
