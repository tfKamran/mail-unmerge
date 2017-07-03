const emailer = require('./emailer');

module.exports = function(emails, callback) {
    emails.forEach(email => {
        emailer(email.to, email.cc, email.bcc, email.subject, email.body, email.attachments, (error, info) => {
            eachEmailCallback(error, info, email);
        });
    });

    var successfulEmails = [];
    var failedEmails = [];

    function eachEmailCallback(error, info, email) {
        error ? failedEmails.push(email) : successfulEmails.push(email);

        if (failedEmails.length + successfulEmails.length == emails.length) {
            callback(successfulEmails, failedEmails);
        }
    }
}
