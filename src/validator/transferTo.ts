import * as path from "path"
import {
    connect,
    addAccount,
    deleteAccountFile,
    connectionClose,
    validateFileInput,
    decryptAccount
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
        })
}
exports.handler = async function (argv) {
    return await transfer(argv)
}

export async function transfer(argv) {
    validateFileInput(argv)

    const web3 = await connect(argv.rpc)
    
    let validator
    let fpath
    if (argv.accountfilepath) {
        fpath = path.resolve(argv.accountfilepath)
        validator = addAccount(web3, fpath)
    } else {
        validator = await decryptAccount(web3, path.resolve(argv.keyfilepath), path.resolve(argv.secretpath))
    }

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
        if (fpath) {
            await deleteAccountFile(argv.accountfilepath)
        }
        await connectionClose(web3)
    }
    return result
}
