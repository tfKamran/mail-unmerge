module.exports = {
    getConfiguration: function() {
        const fs = require('fs');
        const readline = require('readline-sync');

        const configFile = './configs.json';

        if (!fs.existsSync(configFile)) {
            fs.writeFileSync(configFile, '{}', 'utf-8');
        }

        const configs = require(configFile);

        checkAndAskFor("email_id", "What source email address would you like to use? ");
        checkAndAskFor("sender_name", "What name would you like to reflect in the email? ");
        checkAndAskFor("email_server", "What is your outgoing mail server address? ");
        checkAndAskFor("password", "Password for your email address: ", {hideEchoBack: true});

        function checkAndAskFor(key, caption, options) {
            if (!configs[key]) {
                configs[key] = readline.question(caption, options);

                if (!options || !options.hideEchoBack) {
                    fs.writeFileSync(configFile, JSON.stringify(configs), 'utf-8');
                }
            }
        }

        return configs;
    }
};
