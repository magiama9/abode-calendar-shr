const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'donnell.christiansen25@ethereal.email', // GENERATED ETHEREAL EMAIL
    pass: 'HyDDysrASdBjtHy8z5', // GENERATED ETHEREAL PASSWORD
  },
});

// async..await is not allowed in global scope, must use a wrapper
export default async function main(eventObject) {
  // Convert invitees array to string
  const sendToList = eventObject.invitees.join(', ');

  const emailBody =
    '<b>' +
    eventObject.title +
    '</b> starts in 30 minutes <p>' +
    eventObject.description +
    '</p>';
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Cron Overlord" <cron@overlord.com>', // sender address
    to: sendToList, // list of receivers
    subject: eventObject.title, // Subject line
    text: eventObject.description, // plain text body
    html: emailBody, // html body
  });

  console.log('Message sent: %s', info.messageId);
}
