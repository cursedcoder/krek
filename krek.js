#!/usr/bin/env node

const cli = require('yargs');
const pomBumper = require('./bumpers/pom');
const packageBumper = require('./bumpers/package');

cli
  .help('h')
  .alias('h', 'help')
  .version()
  .command('package', 'Bump package.json version.', () => {}, packageBumper)
  .command('pom', 'Bump pom.xml version.', () => {}, pomBumper)
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

const fs = require('fs');

if (cli.argv._.length === 0) {
  if (fs.existsSync('package.json')) {
    packageBumper();
  }

  if (fs.existsSync('pom.xml')) {
    pomBumper();
  }
}
