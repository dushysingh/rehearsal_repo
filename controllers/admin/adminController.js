/*
  *Created by : Dushyant Sengar
  *Purpose : admin
*/
const { check, oneOf, validationResult } = require('express-validator');
const common = require('../../models/CrudFunction');
const AdminTable = require('../../common/table').AdminTable;
const { ReE, ReS, SendMail } = require('../../services/util.service');
const adminMiddleware = require('../../middleware/adminMiddleware');
const config = require("../../config/config");
const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.query;

        let password_encode = Buffer.from(queryObj.password).toString('base64');

            let functionarguments = {
                "res": res,
                "tableName": 'admin',
                "fields": "id, email",
                "where": `email = '${queryObj.username}' and password = '${password_encode}'`
            }
            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {
                    let token = await adminMiddleware.createJwtToken({
                        email: queryObj.username,
                        user: true
                    });
                    console.log(req.userInfo);
                    ReS(res, {'token': token}, 200);
                }
                else {
                    ReE(res, {"msg":"No records found"}, 200);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            })

    },

    forgotPassword: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.query;

        let functionarguments = {
                "res": res,
                "tableName": 'admin',
                "fields": 'id',
                "where": `email = '${queryObj.email}'`
            }

            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {
                    let userData = JSON.parse(JSON.stringify(result));              

                    let token = await adminMiddleware.createJwtToken({
                        email: queryObj.email,
                        type: 'forgot_password'
                    });   
                    
                    let tokenDetail = {
                        "admin_id" : userData[0]['orgid_id'],
                        "token": token
                    }
                   
                    let tokenarguments = {
                        "res": res,
                        "tableName": 'reset_tokens',
                        "addData": tokenDetail
                    }
 
                    let resetToken = await common.AddRecords(tokenarguments);
                    let mailOptions = {
                        from: 'mayank@neosoft.com',
                        to: queryObj.email,
                        subject: 'Forgot Password',
                        text: `Hello , You recently requested for forgot password link. Please click on the following link to reset your password: http://localhost:8080/admin/forgotPasswordEmail/${token}`
                      };

                    let mailResponse = await SendMail(mailOptions);
                      if(mailResponse.status)
                        ReS(res, {}, 200);
                }
                else {
                    ReE(res, {"msg":"No records found"}, 200);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            })

    },

    verifyForgotPasswordEmail: (req, res) => {

            let queryObj = req.params;

            jwt.verify(queryObj.token, config.JwtSupersecret, async (err, response) => {
               let is_used = 0;
               if (err) {
                  ReE(res, err, 500);
               } else {
                  let functionarguments = {
                    "res": res,
                    "tableName": 'reset_tokens',
                    "fields": "id",
                    "where": `token = '${queryObj.token}' and is_used = '${is_used}'`
                  }
                  
                  common.GetRecords(functionarguments).then(async (result) => {
                    if (result && result != '') {   

                        let tokenDetails = {
                            "is_used": '1',
                            "update_time" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                        }
                        let updateResetToken = {
                            "res": res,
                            "tableName": 'reset_tokens',
                            "updateData": tokenDetails,
                            "where": `id = ${result[0]['id']}`
                        }  
                        let tokenResponse = await common.UpdateRecords(updateResetToken);
                        ReS(res, {'msg':'Email verified'}, 200);
                    }
                    else {
                        ReE(res, {"msg":"Token has been used"}, 200);
                    }
                }).catch((err) => {
                    ReE(res, err, 500);
                })                 

               }
            });
    },

    resetPassword: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let password_encode = Buffer.from(queryObj.password).toString('base64');

            let userDetails = {
                "password": password_encode,
                "update_time" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            }

            let functionarguments = {
                "res": res,
                "tableName": 'admin',
                "updateData": userDetails,
                "where": `email = '${queryObj.email}'`
            }
            common.UpdateRecords(functionarguments).then(async (result, error) => {
                if (result) {
                    ReS(res, result, 200);
                } else {
                    ReE(res, error, 500);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            });
    }
}
