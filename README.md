# Validator tool
[![npm (tag)](https://img.shields.io/npm/v/ewf-validator-tool/latest)](https://www.npmjs.com/package/ewf-validator-tool/v/latest)

Command line tool for Volta and EWC validators, for sensitive operations that require to use the validator accounts.
Features:
 - changing of validator payout address
 - checking of validator payout address
 - sending funds from validator account
 - Dockerization to running from validator machines
 - .. with transaction signing locally (not using `personal`, or other compromising APIs)
 - .. with 2 ways of supplying the credentials

:exclamation: Disclaimer: this is my own project, and I am not responsible for any data/key loss, leak or security issue. Use at your own risk.

## Maintainers
Tool: @ngyam

Dockerization: @marcelorocha-e

## Prerequisites
Either:
 - node 8+
 - npm

or:
 - Docker

## Quickstart

Install the command with:
```bash
npm install -g ewf-validator-tool
```
Read about available commands and their options using the `--help` flag
```bash
> validatortool --help

validatortool <command>

Commands:
  validatortool accountfile <filepath>           Creates an empty validator account
  [options]                                 file skeleton. It has to be filled
                                            up with validator address and
                                            private key manually.
  validatortool payout <command>                 Commands related to the validator
                                            payout addresses.
  validatortool transferto <toaddress> <amount>  Makes a value transfer from the
  [options]                                 validator account (or from any
                                            account).

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

For using the docker image, see below.

## How to use the tool

### 1. Supplying the private key (credential)
You can supply your validator account credentials **2 ways** when needed:
 1. Specifying a path to the encrypted ethereum keystore file with the `--keyfilepath` flag AND to to a text file containing only the password with the `--secretpath` flag. The path can be absolute or relative to the working directory.
    Example:
    ```bash
    validatortool transferto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 0.0001 -k "/home/aznagy/.local/share/io.parity.ethereum/keys/Volta/UTC--2018-07-31T13-41-14Z--f18df90c-f86c-0545-9f43-615834e7e778" -s ../../work/ewf/pwd
    ```
    The input files are left untouched.
  1. Specifying the address and private key in a json file in the  format below, then passing the path to `--accountfilepath`. 
     ```json
     {
       "address": "0xYourPublicValidatorAddressHere",
       "privateKey": "0xYourPrivateKeyHere"
     }
     ```
     :exclamation: This file is deleted after usage. This is intentional so you do not forget your private key laying around in a textfile.
     Example:
     ```bash
     validatortool transferto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 0.0001 -a ./account/account.json
     ```
     With the `accountfile ` command you can create an empty accountfile skeleton that you can fill up with your credentials:
     ```bash
     > validatortool accountfile ./account/account.json
     Success! File created at: /home/aznagy/personal/validator-tool/account/account.json
     ```
The imported/decrypted account is added to web3's software wallet for the period of execution and signs transactions locally, not by using the connected node.

### 2. Supplying the rpc address

You can supply an rpc address with the `--rpc` flag. Websocket and http connections are supported. You can connect to remote nodes too, though local ones are always preferred.

### Examples

#### 1. Making a transfer from a validator account
Example 1 with using an accountfile:
```bash
> validatortool transferto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 0.0001 -a ./account/account.json -r https://volta-rpc.energyweb.org

Connected to Volta (test network)
Success!
{
  "blockHash": "0x99a7d18afa2e61b09fae52b08a9ed322766d7eb5166a25d128c00b76e561146b",
  ...
  "transactionHash": "0x96e6d960c8f020df6818925b5320758dd7cf3fadb9283117011acbd809c836ce",
  "transactionIndex": 0
}
Validator account file successfully deleted.
```
Example 2 with a keystore file:
```bash
> validatortool transferto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 0.0001 -k "/home/aznagy/.local/share/io.parity.ethereum/keys/Volta/UTC--2018-07-31T13-41-14Z--f18df90c-f86c-0545-9f43-615834e7e778" -s /home/aznagy/work/ewf/pwd -r wss://volta-rpc.energyweb.org/ws

Connected to Volta (test network)
Success!
{
  "blockHash": "0x7090b1e73351daa4876675f3fd4e3a814468c6d758fca13524b05bafd102b5b2",
  ...
  "transactionHash": "0xd2ffab9b381f3ef410e543f2e7405bf030a27f247fbd2fdd44d0f98788d7a01a",
  "transactionIndex": 0
}
```
#### 2. Checking the payout address of the validator
Example 1:
```bash
> validatortool payout check 0x0052569B2d787bB89d711e4aFB56F9C1E420a2a6 -r https://volta-rpc.energyweb.org

Connected to Volta (test network)
Successful call! Payout address of 0x0052569B2d787bB89d711e4aFB56F9C1E420a2a6 is: 0x2dAA43fBCF5A5A7518b45665cC00D577F080F325
```
Example 2:
```bash
> validatortool payout check 0x2dAA43fBCF5A5A7518b45665cC00D577F080F325 -r wss://volta-rpc.energyweb.org/ws

Connected to Volta (test network)
Successful call! Payout address of 0x2dAA43fBCF5A5A7518b45665cC00D577F080F325 is: 0x2dAA43fBCF5A5A7518b45665cC00D577F080F325
```

#### 3. Changing the payout address of the validator
Example 1 with a keystore file:
```bash
validatortool payout changeto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 -k "/home/aznagy/.local/share/io.parity.ethereum/keys/Volta/UTC--2018-07-31T13-41-14Z--f18df90c-f86c-0545-9f43-615834e7e778" -s /home/aznagy/work/ewf/pwd -r https://volta-rpc.energyweb.org
Connected to Volta (test network)
Change of payout address successful!
{
  "blockHash": "0x7e0eb7fb52d1f45afb9b7b02e74ea29cdff03262903728aa213288301dace598",
  ...
  "transactionHash": "0xae1a6f03a6c204c26155908c13e8e523b300798cefe86d40766b9b579f128ae9",
  "transactionIndex": 0,
  "events": {}
}
```
Example 2 with using an accountfile:
```bash
> validatortool payout changeto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 -a ./account/account.json -r https://volta-rpc.energyweb.org

Connected to Volta (test network)
Change of payout address successful!
{
  "blockHash": "0xd4c867c020ae66f0ad51f1326692d2dcb521630ec7fe0f0e94ef5e0785e3c766",
  ...
  "transactionHash": "0xb323dc1311689416431ed728ef2b87bb2a1d36fe5dd4153ec87d274bee61e391",
  "transactionIndex": 0,
  "events": {}
}
Validator account file successfully deleted.
```

## How to use with Docker
With docker you don't have to have node/npm installed, so it is more feasible and safe to be run on validator machines. The tool is already installed in the container, and in this case it can be only used with the keystore file method.

You need to mount the keystore file and password files as volumes with the `-v` flag like the following:

```bash
docker run -it \
  -v /path/to/the/keystorefile:/keyfile \
  -v /path/to/the/passwordfile:/keypass \
  aznagy/ewf-validator-tool \
  <validator tool command and options>
```
The docker image gets pulled automatically if not found on your machine.

### Examples
#### 1. Making a transfer from a validator account
```bash
docker run -it -v "/home/aznagy/.local/share/io.parity.ethereum/keys/Volta/UTC--2018-07-31T13-41-14Z--f18df90c-f86c-0545-9f43-615834e7e778":/keyfile -v /home/aznagy/work/ewf/pwd:/keypass aznagy/ewf-validator-tool:latest transferto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 0.001 -r wss://volta-rpc.energyweb.org/ws
```
#### 2. Checking the payout address of the validator

```bash
docker run -it -v "/home/aznagy/.local/share/io.parity.ethereum/keys/Volta/UTC--2018-07-31T13-41-14Z--f18df90c-f86c-0545-9f43-615834e7e778":/keyfile -v /home/aznagy/work/ewf/pwd:/keypass aznagy/ewf-validator-tool:latest payout check 0x2dAA43fBCF5A5A7518b45665cC00D577F080F325 -r wss://volta-rpc.energyweb.org/ws
```

#### 3. Changing the payout address of the validator

```bash
docker run -it -v "/home/aznagy/.local/share/io.parity.ethereum/keys/Volta/UTC--2018-07-31T13-41-14Z--f18df90c-f86c-0545-9f43-615834e7e778":/keyfile -v /home/aznagy/work/ewf/pwd:/keypass aznagy/ewf-validator-tool:latest payout changeto 0x2daa43fbcf5a5a7518b45665cc00d577f080f325 -r https://volta-rpc.energyweb.org
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning
[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/ngyam/validator-tool/tags). 

## License

This project is licensed under the GPLv3.0 License - see the [LICENSE.md](LICENSE.md) file for details.
