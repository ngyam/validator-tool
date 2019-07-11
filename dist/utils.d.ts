export declare namespace Constants {
    const REWARD_ADDRESS: string;
    const mapIdToName: {
        246: string;
        73799: string;
        401697: string;
    };
    const rewardContractPath: string;
    const DEFAULT_ADDRESS: string;
}
export declare function connect(endpoint: string): Promise<any>;
export declare function addAccount(web3: any, accountPath: string): string;
export declare function decryptAccount(web3: any, keyfilePath: string, secretPath: string): Promise<string>;
export interface ArgvFileInput {
    accountfilepath?: string;
    keyfilepath?: string;
    secretpath?: string;
}
export declare function validateFileInput(argv: ArgvFileInput): void;
export declare function getRewardContract(web3: any): any;
export declare function deleteAccountFile(accountFilePath: string): Promise<void>;
export declare function connectionClose(web3: any): Promise<void>;
