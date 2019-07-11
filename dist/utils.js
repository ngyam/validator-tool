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
const fs = require("fs-extra");
const path = require("path");
const Web3 = require('web3');
var Constants;
(function (Constants) {
    Constants.REWARD_ADDRESS = "0x1204700000000000000000000000000000000002";
    Constants.mapIdToName = {
        246: "Energy Web Chain (production)",
        73799: "Volta (test network)",
        401697: "Tobalaba (test network)"
    };
    Constants.rewardContractPath = path.join(__dirname, "..", "contracts", "BlockReward.json");
    Constants.DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";
})(Constants = exports.Constants || (exports.Constants = {}));
function connect(endpoint) {
    return __awaiter(this, void 0, void 0, function* () {
        let web3 = new Web3(endpoint);
        console.log(`Connected to ${Constants.mapIdToName[yield web3.eth.getChainId()] || "Unknown network"}`);
        web3.transactionConfirmationBlocks = 1;
        web3.eth.transactionConfirmationBlocks = 1;
        return web3;
    });
}
exports.connect = connect;
function addAccount(web3, accountPath) {
    let validator = JSON.parse(fs.readFileSync(accountPath, "utf-8"));
    web3.eth.accounts.wallet.add(validator);
    return web3.utils.toChecksumAddress(validator.address);
}
exports.addAccount = addAccount;
function decryptAccount(web3, keyfilePath, secretPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let keyObject = yield fs.readJson(keyfilePath);
        let secretString = (fs.readFileSync(secretPath, "utf-8")).trim();
        web3.eth.accounts.wallet.decrypt([keyObject], secretString);
        return web3.utils.toChecksumAddress("0x" + keyObject.address);
    });
}
exports.decryptAccount = decryptAccount;
function validateFileInput(argv) {
    if (!argv["accountfilepath"] && !argv["keyfilepath"] && !argv["secretpath"]) {
        throw ("Error! Validator credentials are needed: Please specify either an --accountfilepath to a json file with address/privateKey fields, or a --keyfilepath/--secretpath for an ethereum keystore file/password file combo.");
    }
    if (!argv["accountfilepath"] && argv["keyfilepath"] && !argv["secretpath"]) {
        throw ("Error! Validator credentials are needed: Please specify a --secretpath to a text file containing the password for the encrypted account.");
    }
    if (!argv["accountfilepath"] && !argv["keyfilepath"] && argv["secretpath"]) {
        throw ("Error! Validator credentials are needed: Please specify a --keyfilepath to an ethereum keystore file of the encrypted account.");
    }
}
exports.validateFileInput = validateFileInput;
function getRewardContract(web3) {
    let RewardJson = JSON.parse(fs.readFileSync(Constants.rewardContractPath, "utf-8"));
    return new web3.eth.Contract(RewardJson.abi, Constants.REWARD_ADDRESS);
}
exports.getRewardContract = getRewardContract;
function deleteAccountFile(accountFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.remove(accountFilePath);
            console.log("Validator account file successfully deleted.");
        }
        catch (error) {
            console.log("Error deleting the account file: " + accountFilePath);
            console.log("Please delete it manually!");
            console.log(error);
        }
    });
}
exports.deleteAccountFile = deleteAccountFile;
function connectionClose(web3) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            web3.currentProvider.connection.close();
        }
        catch (error) { }
    });
}
exports.connectionClose = connectionClose;
//# sourceMappingURL=utils.js.map