import * as fs from "fs-extra"
import * as path from "path"
import { ValidatorAccount } from "./types";
const Web3 = require('web3')

export namespace Constants {
    export const REWARD_ADDRESS: string = "0x1204700000000000000000000000000000000002"
    export const mapIdToName = {
        246: "Energy Web Chain (production)",
        73799: "Volta (test network)",
        401697: "Tobalaba (test network)"
    }
    export const rewardContractPath: string = path.join(__dirname, "..", "contracts", "BlockReward.json")
    export const DEFAULT_ADDRESS: string = "0x0000000000000000000000000000000000000000"
}

export async function connect(endpoint: string): Promise<any> {
    let web3 = new Web3(endpoint)
    console.log(`Connected to ${Constants.mapIdToName[await web3.eth.net.getId()] || "Unknown network"}`)
    web3.transactionConfirmationBlocks = 1
    web3.eth.transactionConfirmationBlocks = 1
    return web3
}

export function addAccount(web3: any, accountPath: string): string {
    let validator: ValidatorAccount = JSON.parse(fs.readFileSync(accountPath, "utf-8"))
    web3.eth.accounts.wallet.add(validator)
    return web3.utils.toChecksumAddress(validator.address)
}

export async function decryptAccount(web3: any, keyfilePath: string, secretPath: string): Promise<string> {
        let keyObject = await fs.readJson(keyfilePath)
        let secretString = (fs.readFileSync(secretPath, "utf-8")).trim()
        web3.eth.accounts.wallet.decrypt([keyObject], secretString)
        return web3.utils.toChecksumAddress("0x" + keyObject.address)
}

export interface ArgvFileInput {
    accountfilepath?: string
    keyfilepath?: string
    secretpath?: string
}

export function validateFileInput(argv: ArgvFileInput) {
    if (!argv["accountfilepath"] && !argv["keyfilepath"] && !argv["secretpath"]) {
        throw("Error! Validator credentials are needed: Please specify either an --accountfilepath to a json file with address/privateKey fields, or a --keyfilepath/--secretpath for an ethereum keystore file/password file combo.")
    }

    if (!argv["accountfilepath"] && argv["keyfilepath"] && !argv["secretpath"]) {
        throw("Error! Validator credentials are needed: Please specify a --secretpath to a text file containing the password for the encrypted account.")
    }

    if (!argv["accountfilepath"] && !argv["keyfilepath"] && argv["secretpath"]) {
        throw("Error! Validator credentials are needed: Please specify a --keyfilepath to an ethereum keystore file of the encrypted account.")
    }
}

export function getRewardContract(web3: any): any {
    let RewardJson = JSON.parse(fs.readFileSync(Constants.rewardContractPath, "utf-8"))
    return new web3.eth.Contract(RewardJson.abi, Constants.REWARD_ADDRESS)
}

export async function deleteAccountFile(accountFilePath: string): Promise<void> {
    try {
        await fs.remove(accountFilePath)
        console.log("Validator account file successfully deleted.")
    } catch (error) {
        console.log("Error deleting the account file: " + accountFilePath)
        console.log("Please delete it manually!")
        console.log(error)
    }
}

export async function connectionClose(web3: any) {
    try {
        web3.currentProvider.connection.close()
    } catch (error) { }
}
