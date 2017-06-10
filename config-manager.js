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
        checkAndAskFor("password", "Password for your email address: ", {hideEchoBack: true});
        checkAndAskFor("email_server", "What is your outgoing mail server address? ");

        function checkAndAskFor(key, caption, options) {
            if (!configs[key]) {
                configs[key] = readline.question(caption, options);
                
                fs.writeFileSync(configFile, JSON.stringify(configs), 'utf-8');
            }
        }

        return configs;
    }
};
