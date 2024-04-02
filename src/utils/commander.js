import {Command} from 'commander';

const program= new Command()

program
    .option('-d', 'Variables para debug', false)
    .option('-p <option>', 'Persistence', String)

program.parse()

export let programOPTS=program.opts()