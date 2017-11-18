const {bumpVersionCli, logBumped, tryCommit} = require('../utils');

const fs = require('fs');

module.exports = async () => {
    if (!fs.existsSync('package.json')) {
        return console.error('package.json does not exists in cwd.');
    }

    const content = fs.readFileSync('package.json');
    const data = JSON.parse(content);
    const version = data.version;

    console.log('Bumping package.json');

    const newVersion = bumpVersionCli(version);
    const output = content.toString().replace(/"version": "[\d.]+"/i, '"version": "' + newVersion + '"');

    logBumped(version, newVersion);

    fs.writeFileSync('package.json', output);
    tryCommit('package', newVersion);
};
