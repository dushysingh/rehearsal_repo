/*
  *Created by : Dushyant Sengar
  *Purpose : organisation
*/
const { check, oneOf, validationResult } = require('express-validator');
const common = require('../../models/CrudFunction');
const OrganisationTables = require('../../common/table');
const { ReE, ReS } = require('../../services/util.service');
const organisationMiddleware = require('../../middleware/organisationMiddleware');

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
                "tableName": 'organisation_users',
                "fields": "org_id, email",
                "where": `email = '${queryObj.username}' and password = '${password_encode}'`
            }
            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {
                    let token = await organisationMiddleware.createJwtToken({
                        email: queryObj.email,
                        user: true
                    });
                    ReS(res, {"token": token}, 200);
                }
                else {
                    ReE(res, {"msg":"No records found"}, 200);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            })

    },

    create: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;

        let password_encode = Buffer.from(queryObj.password).toString('base64');

            let userDetails = {
                "first_name": queryObj.firstName,
                "email": queryObj.email,
                "password": password_encode,
                "last_name": queryObj.lastName,
                "phone_number": queryObj.phoneNumber,
                "status": '1',
                //"created_time" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            }

            let functionarguments = {
                "res": res,
                "tableName": 'organisation_users',
                "addData": userDetails
            }
            common.AddRecords(functionarguments).then(async (result, error) => {
                if (result) {
                    let token = await organisationMiddleware.createJwtToken({
                        email: queryObj.email,
                        user: true
                    });
                    result['token'] = token;
                    ReS(res, result, 200);
                } else {
                    ReE(res, error, 500);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            });
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
                "tableName": OrganisationTables,
                "fields": "id, name, email",
                "where": `username = '${queryObj.username}' and password = '${password_encode}'`
            }
            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {

                    let mailOptions = {
                        from: 'youremail@gmail.com',
                        to: queryObj.email,
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                      };

                    let mailResponse = await SendMail(mailOptions);
                      if(mailResponse.status)
                        ReS(res, mailResponse.msg, 200);
                }
                else {
                    ReS(res, {"msg":"No records found"}, 200);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            })

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
                "tableName": OrganisationTables,
                "updateData": userDetails,
                "where": `email = ${queryObj.email}`
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

    },

    profilePicUpload: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        FileUpload(req, res);

    },

    socialLoginCreate: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.useFirstErrorOnly().mapped(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;

        let password_encode = Buffer.from(queryObj.password).toString('base64');

            let userDetails = {
                "username": queryObj.username,
                "email": queryObj.email,
                "password": password_encode,
                "name": queryObj.name,
                "profile_pic": queryObj.profile_pic,
                "about_me": queryObj.about_me,
                "age": queryObj.age,
                "phone": queryObj.phone,
                "status": '1',
                //"created_time" : new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            }

            let functionarguments = {
                "res": res,
                "tableName": OrganisationTables,
                "addData": userDetails
            }
            common.AddRecords(functionarguments).then(async (result, error) => {
                if (result) {
                    let token = await organisationMiddleware.createJwtToken({
                        name: queryObj.name,
                        email: queryObj.email,
                        user: true
                    });
                    result = result[0].token = token;
                    ReS(res, result, 200);
                } else {
                    ReE(res, error, 500);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            });
    },
}
