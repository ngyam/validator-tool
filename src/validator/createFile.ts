import * as path from "path"
import * as fs from "fs-extra"


exports.command = 'accountfile <filepath> [options]'
exports.desc = "Creates an empty validator account file skeleton. It has to be filled up with validator address and private key manually."
exports.builder = (yargs) => {
    return yargs
        .positional('filepath', {
            desc: 'Path to the validator account file to be created. It will be just an empty skeleton. Missing folders will be created.',
            demandOption: true,
            type: 'string',
            default: undefined
        })
}
exports.handler = async function (argv) {
    return await createAccountFile(argv)
}

export async function createAccountFile(argv) {
    const fpath = path.resolve(argv.filepath)
    try {
        await fs.ensureFile(fpath)
    } catch (error) {
        console.error(`Failed to create ${fpath}`)
        console.error(error)
        return false
    }

    try {
        await fs.writeJson(fpath, { address: "0x_validator_public_address_here", privateKey: "0x_validator_private_key_here" })
        console.log(`Success! File created at: ${fpath}`)
    } catch (error) {
        console.error(`Failed to write into ${fpath}`)
        console.error(error)
        return false
    }

    return true
}
