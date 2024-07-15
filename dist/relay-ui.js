"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadlessUI = void 0;
class HeadlessUI {
    constructor() {
        this.inlineAccountsResponse = () => false;
        this.inlineAddEthereumChain = () => false;
        this.inlineWatchAsset = () => false;
        this.inlineSwitchEthereumChain = () => false;
        this.isStandalone = () => false;
    }
    showConnecting() {
        return () => { };
    }
    setAppSrc() { }
    attach() { }
    requestEthereumAccounts() { }
    addEthereumChain() { }
    watchAsset() { }
    selectProvider() { }
    switchEthereumChain() { }
    signEthereumMessage() { }
    signEthereumTransaction() { }
    submitEthereumTransaction() { }
    ethereumAddressFromSignedMessage() { }
    hideRequestEthereumAccounts() { }
    reloadUI() { }
    setStandalone() { }
    setConnectDisabled() { }
}
exports.HeadlessUI = HeadlessUI;
/* eslint-enable @typescript-eslint/no-empty-function */
//# sourceMappingURL=relay-ui.js.map