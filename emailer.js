var nodemailer = require('nodemailer');

var configs = require("./configs.json");

module.exports = function(to, subject, body, attachments) {
    console.log("Preparing to send email...");

    var transporter = nodemailer.createTransport(configs.email_server);

    var mailOptions = {
        from: '"' + configs.sender_name + '" <' + configs.email_id + '>',
        to: to,
        subject: subject,
        text: body,
        html: body
    };

    if (attachments) {
        mailOptions.attachments = [];

        attachments.forEach(item => {
            mailOptions.attachments.push({
                'filename': item.substring(item.lastIndexOf("/") + 1),
                'path': item
            });
        });
    }

    console.log("Emailing " + to);

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            return console.log("Could not send email: " + error);
        }
        console.log('Email sent: ' + info.response);
    });
}
