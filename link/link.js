#!/usr/bin/env node

const program = require('commander')
const wechartGulp = require('../src/cli')

program
  .version('0.0.1', '-v, --version')

program.on('--help', function () {
  console.log('no help can use')
});

program
  .command('run <init>')
  .action((name, cmd) => {
    let d = process.argv.slice(3)
    if (d[0] !== 'init') {
      console.log(`error: missing required argument 'init'`)
      process.exit(1)
    }

    wechartGulp.run(cmd, name)
  })

program.parse(process.argv);