# mail-unmerge

[![npm version](https://badge.fury.io/js/mail-unmerge.svg)](https://badge.fury.io/js/mail-unmerge)
[![npm downloads](https://img.shields.io/npm/dt/mail-unmerge.svg)](https://www.npmjs.com/package/mail-unmerge)

[![NPM](https://nodei.co/npm/mail-unmerge.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/mail-unmerge/)

A tool to shoot out individual emails to a huge group with unique attachments, configurable with a CSV

## How to install?

You need to have Node.js installed on your system before you can use this package. Get it here: [Node.js](https://nodejs.org/)

Once you have Node.js and NPM setup, the installation is as simple as running a command.

### Linux/Mac

    sudo npm install -g mail-unmerge

### Windows

Within a command prompt window with administrative privileges:

    npm install -g mail-unmerge

## How to use?

### Create a CSV file in the following format:

![CSV Template](./CSVTemplate.png)

The only two fields that are mandatory are `to` and `subject`. `cc` and `bcc` are optional, rest all are custom fields and can be replaced with one of your own. The `attachment` fields are obviously optional.

### Compose your email template

    Hi <name>,

    Here you go: <content>

    Regards,
    HR Team.

You can even use HTML to format your content template.

### Let mail unmerge take control!

    mail-unmerge ./header.csv ./content-template.txt

It will send out individual emails to all the email addresses listed in the CSV file, with personalized attachments.
