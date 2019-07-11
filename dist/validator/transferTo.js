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
const utils_1 = require("../utils");
exports.command = 'transferto <toaddress> <amount> [options]';
exports.desc = "Makes a value transfer from the validator account (or from any account).";
exports.builder = (yargs) => {
    return yargs
        .positional("toaddress", {
        type: 'string',
        desc: "The address to tranfer the native tokens to. Public ethereum address, hex encoded, starting with 0x.",
        demandOption: true,
        default: undefined
    })
        .positional("amount", {
        type: 'string',
        desc: "Amount of native tokens to transfer specified in Ethers.",
        demandOption: true,
        default: undefined
    })
        .option('accountfilepath', {
        desc: 'Path to a validator account file containing the address and private key. This account is used as transaction sender. The file is deleted after use. If --accountfilepath is given, --keyfilepath and --secretpath are ignored.',
        demandOption: false,
        type: 'string',
        alias: ["a", "f"],
        default: undefined
    })
        .option('keyfilepath', {
        desc: 'Path to an ethereum keystore file. They usually start with "UTC" and can be found in the chain folder on your machine. If you specify a --keyfilepath, you must specify a --secretpath too. If --accountfilepath is also given, --keyfilepath and --secretpath are ignored.',
        demandOption: false,
        type: 'string',
        alias: ["kp", "k"],
        default: undefined
    })
        .option('secretpath', {
        desc: 'Path to a textfile containing the password for the keystore file specified with --keyfilepath. If --accountfilepath is given, --keyfilepath and --secretpath are ignored.',
        demandOption: false,
        type: 'string',
        alias: ["sp", "s"],
        default: undefined
    })
        .option('rpc', {
        type: 'string',
        desc: "RPC endpoint of a Parity node. Http and websocket are supported.",
        demandOption: false,
        alias: "r",
        default: "http://localhost:8545"
    })
        .option('gas', {
        type: 'string',
        desc: "Gas limit setting for the transaction given in Wei.",
        demandOption: false,
        alias: "g",
        default: "100000"
    })
        .option('gasprice', {
        type: 'string',
        desc: "Gas price setting for the transaction given in Gwei.",
        demandOption: false,
        alias: ["gp", "p"],
        default: "10"
    });
};
exports.handler = function (argv) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield transfer(argv);
    });
};
function transfer(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        utils_1.validateFileInput(argv);
        const web3 = yield utils_1.connect(argv.rpc);
        let validator;
        let fpath;
        if (argv.accountfilepath) {
            fpath = path.resolve(argv.accountfilepath);
            validator = utils_1.addAccount(web3, fpath);
        }
        else {
            validator = yield utils_1.decryptAccount(web3, path.resolve(argv.keyfilepath), path.resolve(argv.secretpath));
        }
        let result;
        try {
            result = yield web3.eth.sendTransaction({
                from: validator,
                to: web3.utils.toChecksumAddress(argv.toaddress),
                value: web3.utils.toWei(argv.amount, "ether"),
                gas: web3.utils.toWei(argv.gas, "wei"),
                gasPrice: web3.utils.toWei(argv.gasprice, "gwei")
            });
            console.log("Successful transaction!");
            console.log(JSON.stringify(result, null, 2));
        }
        catch (error) {
            console.error("Transaction failed!");
            console.error(error);
            result = error;
        }
        finally {
            if (fpath) {
                yield utils_1.deleteAccountFile(argv.accountfilepath);
            }
            yield utils_1.connectionClose(web3);
        }
        return result;
    });
}
exports.transfer = transfer;
//# sourceMappingURL=transferTo.js.map