// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';

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
  // Stores valid emails
  const validEmails = [];

  // Iterate over the invitees (which includes created by individual at this point) and add them to the valid email list if they match the regex
  eventObject.invitees.forEach((invitee) => {
    const isEmail = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i.test(invitee); // Tests that there is a valid string of 1-64 characters, an @ sign, and a string of 1-64 characters after the @
    if (isEmail) {
      validEmails.push(invitee);
    }
  });

  // Convert valid emails array to string
  const sendToList = validEmails.join(', ');

  const emailBody =
    '<b>' +
    eventObject.title +
    '</b> starts in 30 minutes <p>' +
    eventObject.description +
    '</p>';
  // send mail with defined transport object
  if (sendToList.length > 0) {
    const info = await transporter.sendMail({
      from: '"Cron Overlord" <cron@overlord.com>', // sender address
      to: sendToList, // list of receivers
      subject: eventObject.title, // Subject line
      text: eventObject.description, // plain text body
      html: emailBody, // html body
    });
    console.log('Message sent: %s', info.messageId);
  } else {
    console.error('No valid recipients');
  }
}
