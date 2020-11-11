const { to } = require('await-to-js');
const pe = require('parse-error');
const nodemailer = require('nodemailer');
const multer = require('multer');

module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];

    return [null, res];
};

module.exports.ReE = function (res, err, code) { // Error Web Response
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: false, error: err });
};

module.exports.ReS = function (res, data, code) { // Success Web Response
    let send_data = { success: true };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};

module.exports.TE = TE = function (err_message, log) { // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
    }

    throw new Error(err_message);
};

module.exports.SendMail = (mailOptions, res) => { // Send Mail
    return new Promise(async (resolve, reject) => {

        try {
            let transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.SMTP_USER_NAME,
                    pass: process.env.SMTP_USER_PASSWORD
                }
            });
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve({ "status": true, "msg": info.response });
                }
            });
        } catch (ex) {
            console.log("nodemailer sendmail function error", ex)
        }
    });
};

module.exports.FileUpload = (req, res) => { // File Upload on DiskStorage
    return new Promise(async (resolve, reject) => {

        try {
            // define multer storage configuration
            const storage = multer.diskStorage({
                destination: function (req, file, callback) {
                    callback(null, './public/upload/');
                },
                filename: function (req, file, callback) {
                    callback(null, file.fieldname + '-' + Date.now());
                }
            });

            const upload = multer({ storage: storage });
            this.ReS(res, upload, 200);
        } catch (ex) {
            this.ReE(res, ex, 500);
        }
    });
};