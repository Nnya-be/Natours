const catchAsync = require('./catchAsync');
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  /** Create a transporter */
  const transporter = nodemailer.createTransport({
    host: process.env.USERHOST,
    port: process.env.USERPORT,
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.USERPASSWORD,
    },

    /** Activate the fmail "less secure app" option */
  });
  /** Define the email options */

  const mailOptions = {
    from: 'SolomonOburo <solomonchamamme@io.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  /** Send the email now */

  await transporter.sendMail(mailOptions)
};


module.exports = sendEmail;