import { WalletUI } from '@coinbase/wallet-sdk/dist/provider/WalletUI';
export declare class HeadlessUI implements WalletUI {
    showConnecting(): () => void;
    setAppSrc(): void;
    attach(): void;
    requestEthereumAccounts(): void;
    addEthereumChain(): void;
    watchAsset(): void;
    selectProvider(): void;
    switchEthereumChain(): void;
    signEthereumMessage(): void;
    signEthereumTransaction(): void;
    submitEthereumTransaction(): void;
    ethereumAddressFromSignedMessage(): void;
    hideRequestEthereumAccounts(): void;
    reloadUI(): void;
    setStandalone?(): void;
    setConnectDisabled(): void;
    inlineAccountsResponse: () => boolean;
    inlineAddEthereumChain: () => boolean;
    inlineWatchAsset: () => boolean;
    inlineSwitchEthereumChain: () => boolean;
    isStandalone: () => boolean;
}
