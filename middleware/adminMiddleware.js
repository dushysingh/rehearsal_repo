const config = require("../config/config");
const jwt = require('jsonwebtoken');

module.exports =
{
  createJwtToken: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        jwt.sign({ user }, config.JwtSupersecret, { expiresIn: '24h' }, (err, token) => {
          resolve(token)
        });
      } catch (ex) {
        console.log("WriteOnJSONfile function error", ex)
      }
    })
  },
  checkToken: (req, res, next) => {
      if (req.headers.authorization) {
        try {
          jwt.verify(req.headers.authorization, config.JwtSupersecret, async (err, response) => {
            if (response) {
              req.userInfo = response.user;
              next();
            }
            else {
              console.error(err)
              res.json({ "Unautherized": "Unautherized User" })
            }
          })
        } catch (ex) {
          res.json({ success: false, message: 'Invalid Token' });
        }
      } else {
        res.json({ success: false, message: 'No token provided' });
      }   
  }
}