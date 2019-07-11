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
const utils_1 = require("../../utils");
exports.command = 'check <address> [options]';
exports.desc = "Checks the payout address of a validator (or any account).";
exports.builder = (yargs) => {
    return yargs
        .positional("address", {
        type: 'string',
        desc: "The address to check. Can be any address, not only validator. Public ethereum address, hex encoded, starting with 0x.",
        demandOption: true,
        default: undefined
    })
        .option('rpc', {
        type: 'string',
        desc: "RPC endpoint of a Parity node. Http and websocket are supported.",
        demandOption: false,
        alias: "r",
        default: "http://localhost:8545"
    });
};
exports.handler = function (argv) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield checkPayoutAddress(argv);
    });
};
function checkPayoutAddress(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const web3 = yield utils_1.connect(argv.rpc);
        let contract = utils_1.getRewardContract(web3);
        let address = web3.utils.toChecksumAddress(argv.address);
        let result;
        try {
            result = yield contract.methods.payoutAddresses(address).call();
            result = result === utils_1.Constants.DEFAULT_ADDRESS ? address : result;
            console.log(`Successful call! Payout address of ${address} is: ${result}`);
        }
        catch (error) {
            console.error("Call failed!");
            console.error(error);
        }
        finally {
            utils_1.connectionClose(web3);
        }
        return result;
    });
}
exports.checkPayoutAddress = checkPayoutAddress;
//# sourceMappingURL=check.js.map