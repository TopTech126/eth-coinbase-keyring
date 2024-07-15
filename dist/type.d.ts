import { SignTypedDataVersion } from '@metamask/eth-sig-util';
import { Hex } from '@metamask/utils';
export declare const SESSION_STATUS_MAP: {
    CONNECTED: string;
    DISCONNECTED: string;
    ACCOUNT_ERROR: string;
    REJECTED: string;
    ADDRESS_DUPLICATE: string;
    ACCOUNT_CHANGED: string;
    CHAIN_CHANGED: string;
};
export declare type KeyringOptions = {
    accounts?: Hex[];
};
export declare type KeyringOpt = {
    withAppKeyOrigin?: string;
    version?: SignTypedDataVersion | string;
};
