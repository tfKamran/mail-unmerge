#! /usr/bin/env node

const csv = require('csvtojson');
const fs = require('fs');
const readline = require('readline-sync');
const batchEmailer = require('./batch-emailer');

if (process.argv.length != 4) {
    console.log(
        "You need to pass in two arguments:\n"
        + "\n"
        + "1. CSV file\n"
        + "2. Email body file\n"
        + "\n"
        + "Example:\n"
        + "\n"
        + "\tmail-unmerge ./header.csv ./content-template.html\n"
        );

    return;
}

const headerCSV = process.argv[2];
const contentTemplate = process.argv[3];

intiateEmails(headerCSV, contentTemplate);

function intiateEmails(headerCSV, contentTemplate) {
    const headerJSON = [];

    const emailBodyTemplate = fs.readFileSync(contentTemplate, 'utf-8').split("\n").join("<br />");

    csv().fromFile(headerCSV)
        .on('json', (item) => {
            headerJSON.push(item);
        })
        .on('done', (error) => {
            if (error) {
                console.log("Error parsing CSV file");
            } else {
                var batchEmail = [];

                headerJSON.forEach(function(item, index, allItems) {
                    var emailBody = emailBodyTemplate;

                    var attachments = [];

                    Object.keys(item).forEach(key => {
                        emailBody = emailBody.split("<" + key + ">").join(item[key]);

                        if (key.startsWith("attachment")) {
                            attachments.push(item[key]);
                        }
                    });

                    batchEmail.push({
                        "to": item.to,
                        "cc": item.cc,
                        "bcc": item.bcc,
                        "subject": item.subject,
                        "body": emailBody,
                        "attachments": attachments,
                        "_header": item
                    });
                });

                console.log("Attempting to send " + batchEmail.length + " emails, please wait...");
                batchEmailer(batchEmail, emailCallback);
            }
        });

    function emailCallback(successfulEmails, failedEmails) {
        if (failedEmails.length == 0) {
            console.log("All emails were sent successfully");

            readline.question("Press enter to exit\n");
        } else {
            const failedEmailAddresses = failedEmails.map(email => email.to);
            console.log("Sending failed for: " + failedEmailAddresses);

            failedEmails.forEach(email => addFailedRecordInCSV(email._header));

            if (readline.question('Would you like to retry sending the failed ones? (Y/n) ').match(/[Yy]/)) {
                intiateEmails(getNextRetryCSVFileName(), contentTemplate);
            }
        }
    }

    function getNextRetryCSVFileName() {
        return headerCSV.substring(0, headerCSV.length - 4) + '-retry.csv';
    }

    function addFailedRecordInCSV(item) {
        createFailedHeaderCSVFileIfNeeded(item);

        var row = '';
        Object.keys(item).forEach(key => {
            row += item[key] + ',';
        });

        fs.appendFileSync(getNextRetryCSVFileName(),
            '\n' + row.substring(0, row.length - 1),
            'utf8');
    }

    function createFailedHeaderCSVFileIfNeeded(item) {
        if (!fs.existsSync(getNextRetryCSVFileName())) {
            createFailedHeaderCSVFile(item);
        }
    }

    function createFailedHeaderCSVFile(item) {
        var header = '';
            Object.keys(item).forEach(key => {
            header += key + ',';
        });

        fs.writeFileSync(getNextRetryCSVFileName(),
            header.substring(0, header.length - 1),
            'utf8');
    }
}
