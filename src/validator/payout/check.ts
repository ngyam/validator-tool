import {
    connect,
    getRewardContract,
    Constants,
    connectionClose
} from "../../utils"

exports.command = 'check <address> [options]'
exports.desc = "Checks the payout address of a validator (or any account)."
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
        })
}
exports.handler = async function (argv) {
    return await checkPayoutAddress(argv)
}

export async function checkPayoutAddress(argv) {
    const web3 = await connect(argv.rpc)
    let contract = getRewardContract(web3)
    let address = web3.utils.toChecksumAddress(argv.address)
    let result
    try {
        result = await contract.methods.payoutAddresses(address).call()
        result = result === Constants.DEFAULT_ADDRESS ? address: result
        console.log(`Successful call! Payout address of ${address} is: ${result}`)
    } catch (error) {
        console.error("Call failed!")
        console.error(error)
    } finally {
        connectionClose(web3)
    }
    return result
}
