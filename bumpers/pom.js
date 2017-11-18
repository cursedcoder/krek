const {bumpVersionCli, logBumped, tryCommit} = require('../utils');

const fs = require('fs');

module.exports = async () => {
    if (!fs.existsSync('pom.xml')) {
        return console.error('pom.xml does not exists in cwd.');
    }

    const xml = require('xml2js');
    const content = fs.readFileSync('pom.xml');

    xml.parseString(content, (err, data) => {
        const version = data.project.version[0];

        console.log('Bumping pom.xml');

        const newVersion = bumpVersionCli(version);
        const output = content.toString().replace(/<version>.*<\/version>/, '<version>' + newVersion + '</version>');

        logBumped(version, newVersion);

        fs.writeFileSync('pom.xml', output);
        tryCommit('pom', newVersion);
    });
};
