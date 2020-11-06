/*
  *Created by : Dushyant Sengar
  *Purpose : admin
*/
const { check, oneOf, validationResult } = require('express-validator');
const common = require('../../models/CrudFunction');
const AdminTable = require('../../common/table').AdminTable;
const { ReE, ReS } = require('../../services/util.service');
const adminMiddleware = require('../../middleware/adminMiddleware');

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
                "tableName": AdminTable,
                "fields": "id, name, email",
                "where": `email = '${queryObj.email}' and password = '${password_encode}'`
            }
            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {
                    const user = {
                        email: queryObj.email
                    }
                    ReS(res, user, 200);
                }
                else {
                    ReS(res, {"msg":"No records found"}, 200);
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
                "tableName": AdminTable,
                "fields": "id, email",
                "where": `email = '${queryObj.email}' and password = '${password_encode}'`
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
                "tableName": AdminTable,
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

    }
}
