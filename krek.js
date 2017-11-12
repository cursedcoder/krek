#!/usr/bin/env node
const fs = require('fs');

const logBumped = (from, to) => {
  console.log('Bumped from ' + from + ' to ' + (to));
};

const cli = require('yargs');

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

cli
  .help('h')
  .alias('h', 'help')
  .version()
  .command('package', 'Bump package.json version.', () => {
  }, async () => {
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
  })
  .command('pom', 'Bump pom.xml version.', () => {
  }, async () => {
    if (!fs.existsSync('pom.xml')) {
      return console.error('pom.xml does not exists in cwd.');
    }

    const xml = require('xml2js');
    const content = fs.readFileSync('pom.xml');

    xml.parseString(content, (err, data) => {
      const version = data.project.version[0];

      console.log('Bumping pom.xml');

      const newVersion = bumpVersionCli(version);
      const output = content.toString().replace(/<version>.*<\/version>/, '<version>' + newVersion + '</version>')

      logBumped(version, newVersion);

      fs.writeFileSync('pom.xml', output);
      tryCommit('pom', newVersion);
    });
  })
  .option('major', {
    alias: 'x',
    default: false
  })
  .option('minor', {
    alias: 'y',
    default: false
  })
  .option('commit', {
    alias: 'c',
    default: false
  });

if (cli.argv._.length === 0) {
  cli.showHelp();
}
