const nodemailer = require('nodemailer');
const urlencode = require('urlencode');
const configs = require('./config-manager').getConfiguration();

module.exports = function(to, subject, body, attachments, callback) {
    var transporter = nodemailer.createTransport(
        configs.email_server.substring(0, configs.email_server.indexOf("://") + 3)
        + urlencode(configs.email_id)
        + ":"
        + urlencode(configs.password)
        + "@"
        + configs.email_server.substring(configs.email_server.indexOf("://") + 3)
        );

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
                'filename': (item.indexOf("/") > -1 ?
                        item.substring(item.lastIndexOf("/") + 1)
                        : item.substring(item.lastIndexOf("\\") + 1)),
                'path': item
            });
        });
    }

    transporter.sendMail(mailOptions, callback);
}
