"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
exports.command = 'accountfile <filepath> [options]';
exports.desc = "Creates an empty validator account file skeleton. It has to be filled up with validator address and private key manually.";
exports.builder = (yargs) => {
    return yargs
        .positional('filepath', {
        desc: 'Path to the validator account file to be created. It will be just an empty skeleton. Missing folders will be created.',
        demandOption: true,
        type: 'string',
        default: undefined
    });
};
exports.handler = function (argv) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield createAccountFile(argv);
    });
};
function createAccountFile(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const fpath = path.resolve(argv.filepath);
        try {
            yield fs.ensureFile(fpath);
        }
        catch (error) {
            console.error(`Failed to create ${fpath}`);
            console.error(error);
            return false;
        }
        try {
            yield fs.writeJson(fpath, { address: "0x_validator_public_address_here", privateKey: "0x_validator_private_key_here" });
            console.log(`Success! File created at: ${fpath}`);
        }
        catch (error) {
            console.error(`Failed to write into ${fpath}`);
            console.error(error);
            return false;
        }
        return true;
    });
}
exports.createAccountFile = createAccountFile;
//# sourceMappingURL=createFile.js.map