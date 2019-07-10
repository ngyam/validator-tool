#!/usr/bin/env node

import * as yargs from 'yargs'

yargs
    .commandDir('validator')
    .demandCommand(1, 'You need to give at least a command.')
    .help()
    .parserConfiguration({
        "yargs": {
            "parse-numbers": false,
        }
    })
    .argv

export * from "./validator"
export * from "./types"
export * from "./utils"
