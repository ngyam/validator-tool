import * as path from "path"
import {
    connect,
    addAccount,
    deleteAccountFile,
    getRewardContract,
    connectionClose
} from "../../utils"


exports.command = 'changeto <payoutaddress> [options]'
exports.desc = "Changes the payout address of a validator (or any account)."
exports.builder = (yargs) => {
    return yargs
        .positional("payoutaddress", {
            type: 'string',
            desc: "The new payout address for the validator (or any address). Public ethereum address, hex encoded, starting with 0x.",
            demandOption: true,
            default: undefined
        })
        .options('accountfilepath', {
            desc: 'Path to the validator account file containing the address and private key. This account is used as transaction sender. The file is deleted after use.',
            demandOption: true,
            type: 'string',
            alias: ["a", "f"],
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
        })
}
exports.handler = async function (argv) {
    return await changePayoutAddress(argv)
}

export async function changePayoutAddress(argv) {
    const web3 = await connect(argv.rpc)
    const fpath = path.resolve(argv.accountfilepath)
    let validator = addAccount(web3, fpath)
    let contract = getRewardContract(web3)

    let result
    try {
        result = await contract.methods.setPayoutAddress(web3.utils.toChecksumAddress(argv.payoutaddress)).send({
            from: validator,
            gas: web3.utils.toWei(argv.gas, "wei"),
            gasPrice: web3.utils.toWei(argv.gasprice, "gwei")
        })
        console.log("Change successful!")
        console.log(JSON.stringify(result, null, 2))
    } catch (error) {
        console.error(error)
        result = error
    } finally {
        //await deleteAccountFile(argv.accountfilepath)
        await connectionClose(web3)
    }
    return result
}
