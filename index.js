#! /usr/bin/env node

const csv = require('csvtojson');
const fs = require('fs');
const email = require('./emailer');

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

const emailBodyTemplate = fs.readFileSync(contentTemplate, 'utf-8').split("\n").join("<br />");

csv().fromFile(headerCSV)
    .on('json', processEmailItem)
    .on('done', (error) => {
        if (error) {
            console.log("Error parsing CSV file");
        }
    });

function processEmailItem(item) {
    var emailBody = emailBodyTemplate;

    var attachments = [];

    Object.keys(item).forEach(key => {
        emailBody = emailBody.split("<" + key + ">").join(item[key]);

        if (key.startsWith("attachment")) {
            attachments.push(item[key]);
        }
    });

    email(item.email, item.subject, emailBody, attachments);
}
