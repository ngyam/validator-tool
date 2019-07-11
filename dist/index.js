#!/usr/bin/env node
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
yargs
    .commandDir('validator')
    .demandCommand(1, 'You need to give at least a command.')
    .help()
    .parserConfiguration({
    "yargs": {
        "parse-numbers": false,
    }
})
    .argv;
__export(require("./validator"));
__export(require("./utils"));
//# sourceMappingURL=index.js.map