/*
  *Created by : Dushyant Sengar
  *Purpose : organisation
*/
const { check, oneOf, validationResult } = require('express-validator');
const common = require('../../models/CrudFunction');
const OrganisationTables = require('../../common/table');
const { ReE, ReS } = require('../../services/util.service');
const organisationMiddleware = require('../../middleware/organisationMiddleware');
const { CostExplorer } = require('aws-sdk');

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
                        org_id: result[0]['org_id'],
                        user_type: 'admin',
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
                "tableName": 'organisation_users',
                "fields": 'org_id',
                "where": `email = '${queryObj.email}'`
            }

            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {
                    let userData = JSON.parse(JSON.stringify(result));              

                    let token = await organisationMiddleware.createJwtToken({
                        email: queryObj.email,
                        type: 'forgot_password'
                    });   
                    
                    let tokenDetail = {
                        "org_id" : userData[0]['org_id'],
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
                        text: `Hello , You recently requested for forgot password link. Please click on the following link to reset your password: http://localhost:8080/organisations/forgotPasswordEmail/${token}`
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
                "tableName": 'organisation_users',
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

    },

    profilePicUpload: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        FileUpload(req, res);

    },

    ensembleCreate: (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let ensableDetails = {
            "name": queryObj.name,
            "org_id": req.userInfo.org_id
        }

        let functionarguments = {
            "res": res,
            "tableName": 'ensembles',
            "addData": ensableDetails
        }

        common.AddRecords(functionarguments).then(async (result, error) => {
            if (result) {
                ReS(res, result, 200);
            } else {
                ReE(res, error, 500);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        });
    },

    ensembleList: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

            let functionarguments = {
                "res": res,
                "tableName": 'ensembles',
                "fields": "id, org_id, name",
                "where": `org_id = ${req.userInfo.org_id}`
            }
            common.GetRecords(functionarguments).then(async (result) => {
                if (result && result != '') {
                    ReS(res, result , 200);
                }
                else {
                    ReE(res, {"msg":"No records found"}, 200);
                }
            }).catch((err) => {
                ReE(res, err, 500);
            })

    },

    trackRequest: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let trackDetails = {
            "song_title": queryObj.title,
            "composer_name" : queryObj.composer_name,
            "org_id": req.userInfo.org_id
        }

        let functionarguments = {
            "res": res,
            "tableName": 'organisation_track_request',
            "addData": trackDetails
        }

        common.AddRecords(functionarguments).then(async (result, error) => {
            if (result) {
                ReS(res, result, 200);
            } else {df
                ReE(res, error, 500);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        });

    },

    searchSong: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.query;

        let functionarguments = {
            "res": res,
            "tableName": 'organisation_track_request',
            "fields": "request_id, org_id, song_title",
            "where": `org_id = ${req.userInfo.org_id} and song_title = '${queryObj.title}'`
        }

        common.GetRecords(functionarguments).then(async (result) => {
            if (result && result != '') {
                ReS(res, result , 200);
            }
            else {
                ReE(res, {"msg":"No records found"}, 200);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        })

    },

    libraryAdd: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let libraryDetails = {
            "library_name" : queryObj.library_name,
            "org_id": req.userInfo.org_id
        }

        let functionarguments = {
            "res": res,
            "tableName": 'organisation_mylibrary',
            "addData": libraryDetails
        }

        common.AddRecords(functionarguments).then(async (result, error) => {
            if (result) {
                ReS(res, result, 200);
            } else {df
                ReE(res, error, 500);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        });

    },

    addSongToLibrary:  (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let songDetails = {
            "mylibrary_id" : queryObj.library_id,
            "song_id" : queryObj.song_id,
            "org_id": req.userInfo.org_id
        }

        let functionarguments = {
            "res": res,
            "tableName": 'organisation_mylibrary_song',
            "addData": songDetails
        }

        common.AddRecords(functionarguments).then(async (result, error) => {
            if (result) {
                ReS(res, result, 200);
            } else {df
                ReE(res, error, 500);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        });

    },

    songList:  (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let functionarguments = {
            "res": res,
            "tableName": 'organisation_track_request',
            "fields": "request_id, org_id, song_title",
            "where": `org_id = ${req.userInfo.org_id} and status = '1'`
        }

        common.GetRecords(functionarguments).then(async (result) => {
            if (result && result != '') {
                ReS(res, result , 200);
            }
            else {
                ReE(res, {"msg":"No records found"}, 200);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        })

    },

    librarySongsList: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.query;
        let query ={ sql: `SELECT Mylibrary.id, Mylibrary.song_id AS song_id, Song.song_title AS song_name FROM organisation_mylibrary_song as Mylibrary JOIN organisation_track_request as Song ON Mylibrary.song_id = Song.request_id where Mylibrary.mylibrary_id = ${queryObj.library_id}`}

        common.CustomQuery(query).then(async (result) => {
            if (result && result != '') {
                ReS(res, result , 200);
            }
            else {
                ReE(res, {"msg":"No records found"}, 200);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        })

    },

    deleteLibrarySong: (req, res) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            ReE(res, errors.array(), 422);
            //return res.status(422).json({ errors: errors.array() })
        }

        let queryObj = req.body;
        let functionarguments = {
            "res": res,
            "tableName": 'organisation_mylibrary_song',
            "where": `org_id = ${req.userInfo.org_id} and id = ${queryObj.song_id}`
        }

        common.DeleteRecords(functionarguments).then(async (result) => {
            if (result && result != '') {
                ReS(res, result , 200);
            }
            else {
                ReE(res, {"msg":"No records found"}, 200);
            }
        }).catch((err) => {
            ReE(res, err, 500);
        })

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
