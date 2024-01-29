const nodemailer = require("nodemailer");

const nodemailerConfig = {
    service: process.env.MAIL_SERVICE, // e.g., 'gmail'
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
    },
};
const transporter = nodemailer.createTransport(nodemailerConfig);

const getTransporter = (mailOptions, onError, onSuccess) => {
    return transporter;
};

const sendMail = (mailOptions, onError, onSuccess) => {
    if (!mailOptions.from) {
        mailOptions.from = process.env.MAIL_AUTH_USER;
    }
    if (!mailOptions.subject) {
        mailOptions.subject = "Shut-up application service";
    }
    transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            return onError(error);
        }
        onSuccess(data);
    });
};

module.exports = { sendMail, getTransporter };
