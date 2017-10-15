#!/usr/bin/env node
const fs = require('fs');

const logBumped = (version) => {
  console.log('Bumped from ' + version + ' to ' + (version + 1));
};

const cli = require('yargs')
  .help('h')
  .alias('h', 'help')
  .version()
  .command('package', 'Bump package.json version.', () => {}, async (argv) => {
    if (!fs.existsSync('package.json')) {
      return console.error('package.json does not exists in cwd.');
    }

    const content = fs.readFileSync('package.json');
    const data = JSON.parse(content);
    const version = parseInt(data.version);

    console.log('Bumping package.json');
    logBumped(version);

    const newVersion = (version + 1).toString();
    const output = content.toString().replace(/"version": "[\d.]+"/i, '"version": "' + newVersion + '"');

    fs.writeFileSync('package.json', output);
  })
  .command('pom', 'Bump pom.xml version.', () => {}, async (argv) => {
    if (!fs.existsSync('pom.xml')) {
      return console.error('pom.xml does not exists in cwd.');
    }

    const xml = require('xml2js');
    const content = fs.readFileSync('pom.xml');

    xml.parseString(content, (err, data) => {
      const version = parseInt(data.project.version[0]);

      console.log('Bumping pom.xml');
      logBumped(version);

      const newVersion = (version + 1).toString();
      const output = content.toString().replace(/<version>.*<\/version>/, '<version>' + newVersion + '</version>')

      fs.writeFileSync('pom.xml', output);
    });
  });

if (cli.argv._.length === 0) {
  cli.showHelp();
}
