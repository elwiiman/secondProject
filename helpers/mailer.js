const nodemailer = require("nodemailer");
const pug = require("pug");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service:"Sengrid",
  auth: {
    user:process.env.MAILER_USER,
    pass:process.env.MAILER_PASS
  }
});

const generateHTML = (filename,options) => {
  const html = pug.compileFile(`${__dirname}/../views/mails/${filename}.pug`);
  return html(options);
};


