/*
  Created by : Dushyant Sengar
  Purpose : Database Connection

*/
let mysql = require('mysql');
const { ReE } = require('../services/util.service');
const dotenv = require('dotenv');
dotenv.config();
// database connection according to server
let devConn = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};


module.exports = {
  mysqldbConnection: async (res) => {
    try {
      return new Promise((resolve, reject) => {
        let con = mysql.createConnection(devConn);
        console.info(devConn);
        con.connect(function (err) {
          if (err)
            ReE(res, "Database Is Not Connected", 500)
          else
            resolve(con);
        })
      })
    } catch (ex) {
      return await ex;
    }
  },

};

