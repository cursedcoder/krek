const cli = require('yargs');

const tryCommit = (type, version) => {
    if (true !== cli.argv.commit) {
        return;
    }

    const cp = require('child_process');

    if (type === 'pom') {
        cp.execSync('git add pom.xml');
    }

    if (type === 'package') {
        cp.execSync('git add package.json');
    }

    const output = cp.execSync('git commit -m "Bumped ' + type + ' to version ' + version + '"');

    console.log(output.toString());
};

const logBumped = (from, to) => {
    console.log('Bumped from ' + from + ' to ' + (to));
};

const bumpVersionString = (string, level) => {
    const split = string.toString().split('.').map(str => parseInt(str));

    switch (level) {
        case 'x':
            split[0]++;
            split[1] = 0;
            split[2] = 0;
            break;
        case 'y':
            split[1]++;
            split[2] = 0;
            break;
        case 'z':
            split[2]++;
            break;
    }

    return split.join('.');
};

const bumpVersionCli = (string) => {
    let level = 'z';

    switch (true) {
        case true === cli.argv.x:
            level = 'x';
            break;

        case true === cli.argv.y:
            level = 'y';
            break;
    }

    return bumpVersionString(string, level);
};

module.exports = {
    logBumped,
    tryCommit,
    bumpVersionCli,
    bumpVersionString
};
