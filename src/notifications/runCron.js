const cron = require('node-cron');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'sabina.parker@ethereal.email', // GENERATED ETHEREAL EMAIL
    pass: 't7rcBtyXeNfSZXuXDJ', // GENERATED ETHEREAL PASSWORD
  },
});
// async..await is not allowed in global scope, must use a wrapper

async function main(eventObject) {
  // Convert invitees array to string
  console.log('running');
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
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

async function runMailer() {
  main(eventObject).catch(console.error);
}
// main({ eventObject }).catch(console.error);

// module.exports = {
//   eventObject,
//   main,
// };

const runJob = cron.schedule(
  '*/15 * * * * *',
  function () {
    const eventObject = {
      start: new Date(),
      end: new Date(),
      title: 'TestTitle',
      description: 'AbCdEfG',
      invitees: ['test@test.com', 'test2@test2.com'],
    };
    main(eventObject);
  },
  null,
  true,
);
