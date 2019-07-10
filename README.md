# Validator tool

Command line tool for Volta and EWC validator accounts.
Features:
 - changing of validator payout address
 - checking of validator payout address
 - sending funds from validator account
 - transaction signing locally (not using `personal`, or other compromising APIs)
 - burns input file after reading

Disclaimer: this is my own project, and I am not responsible for any data/key loss or security issue. Use at your own risk.

## Quickstart

Install the command with:
```bash
npm install -g validator-tool
```
Read about available commands and options using the `--help` flag
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
