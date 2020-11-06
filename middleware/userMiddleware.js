const config = require("../config/config");
const jwt = require('jsonwebtoken');

module.exports =
{
  createJwtToken: (user) => {
    return new Promise(async (resolve, reject) => {
      try {
        jwt.sign({ user }, config.JwtSupersecret, { alg: "RS256", expiresIn: '24h' }, (err, token) => {
          resolve(token)
        });
      } catch (ex) {
        console.log("WriteOnJSONfile function error", ex)
      }
    })
  },
  checkToken: (req, res, next) => {
    return new Promise(async (resolve, reject) => {

      if (req.headers.authorization) {
        try {
          jwt.verify(req.headers.authorization, config.JwtSupersecret, async (err, response) => {
            if (response) {
              next();
              resolve(true);
            }
            else {
              console.error(err)
              ReE(res, { "Unautherized": "Unautherized User" }, 401)
            }
          })
        } catch (ex) {
          console.log("WriteOnJSONfile function error", ex)
        }
      }
    })
  }
}