import * as path from "path"
import {
    connect,
    addAccount,
    deleteAccountFile,
    connectionClose
} from "../utils"


exports.command = 'transferto <toaddress> <amount> [options]'
exports.desc = "Makes a value transfer from the validator account (or from any account)."
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
        .options('accountfilepath', {
            desc: 'Path to the validator account file containing the address and private key. This account is used as transaction sender. The file is deleted after use.',
            demandOption: true,
            type: 'string',
            alias: ["acc", "a", "f"],
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
    return await transfer(argv)
}

export async function transfer(argv) {
    const web3 = await connect(argv.rpc)
    const fpath = path.resolve(argv.accountfilepath)
    const validator = addAccount(web3, fpath)

    let result
    try {
        result = await web3.eth.sendTransaction({
            from: validator,
            to: web3.utils.toChecksumAddress(argv.toaddress),
            value: web3.utils.toWei(argv.amount, "ether"),
            gas: web3.utils.toWei(argv.gas, "wei"),
            gasPrice: web3.utils.toWei(argv.gasprice, "gwei")
        })
        console.log("Success!")
        console.log(JSON.stringify(result, null, 2))
    } catch (error) {
        console.error("Transaction failed!")
        console.error(error)
        result = error
    } finally {
        await deleteAccountFile(fpath)
        await connectionClose(web3)
    }
    return result
}
