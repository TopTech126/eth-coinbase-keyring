/// <reference types="node" />
import { TypedTransaction } from '@ethereumjs/tx';
import { Hex, Keyring } from '@metamask/utils';
import EventEmitter from 'events';
import { KeyringOptions, KeyringOpt } from './type';
export declare const LINK_API_URL = "https://www.walletlink.org";
export default class CoinbaseKeyring extends EventEmitter implements Keyring<KeyringOptions> {
    #private;
    readonly type: string;
    static type: string;
    accountToAdd?: string;
    constructor(options?: KeyringOptions);
    serialize(): Promise<{
        accounts: `0x${string}`[];
    }>;
    deserialize(options: KeyringOptions): Promise<void>;
    setAccountToAdd(account: string): void;
    addAccounts(): Promise<`0x${string}`[]>;
    getAccounts(): Promise<`0x${string}`[]>;
    signTransaction(address: Hex, transaction: TypedTransaction): Promise<any>;
    signMessage(address: Hex, message: string): Promise<string>;
    signPersonalMessage(address: Hex, msgHex: Hex): Promise<string>;
    signTypedData(address: Hex, typedData: any, opts?: KeyringOpt): Promise<string>;
    removeAccount(address: string): void;
    connect(opts?: {
        address?: string;
        appName?: string;
        appIcon?: string;
    }): string | null | undefined;
    getSessionStatus(address: string): "DISCONNECTED" | "CONNECTED" | "ACCOUNT_ERROR" | "REJECTED" | "ADDRESS_DUPLICATE" | "ACCOUNT_CHANGED" | "CHAIN_CHANGED" | undefined;
    getSessionAccount(address: string): {
        chainId: number | undefined;
        account: `0x${string}` | undefined;
        status: "DISCONNECTED" | "CONNECTED" | "ACCOUNT_ERROR" | "REJECTED" | "ADDRESS_DUPLICATE" | "ACCOUNT_CHANGED" | "CHAIN_CHANGED" | undefined;
    };
    closeConnector({ address }: {
        address: string;
    }, silent: boolean): void;
    switchEthereumChain(_: string, chainId: number, address: string): Promise<void>;
}
