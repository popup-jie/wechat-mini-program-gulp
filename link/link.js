#!/usr/bin/env node

const program = require('commander')
const wechartGulp = require('../src/cli')

program
  .version('0.0.1', '-v, --version')

program.on('--help', function () {
  console.log('no help can use')
});

program
  .command('run <name>')
  .action((name, cmd) => {
    wechartGulp.run(name, cmd)
  })

program.parse(process.argv);