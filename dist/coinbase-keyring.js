"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _CoinbaseKeyring_instances, _CoinbaseKeyring_accounts, _CoinbaseKeyring_sessions, _CoinbaseKeyring_initRelay, _CoinbaseKeyring_emit;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_API_URL = void 0;
const CoinbaseWalletProvider_1 = require("@coinbase/wallet-sdk/dist/provider/CoinbaseWalletProvider");
const WalletLinkRelay_1 = require("@coinbase/wallet-sdk/dist/relay/WalletLinkRelay");
const WalletSDKRelayEventManager_1 = require("@coinbase/wallet-sdk/dist/relay/WalletSDKRelayEventManager");
const version_1 = require("@coinbase/wallet-sdk/dist/version");
const utils_1 = require("@metamask/utils");
// eslint-disable-next-line import/no-nodejs-modules
const events_1 = __importDefault(require("events"));
// eslint-disable-next-line import/no-extraneous-dependencies
const uuid_1 = require("uuid");
const relay_ui_1 = require("./relay-ui");
const storage_1 = require("./storage");
const TYPE = 'Coinbase';
exports.LINK_API_URL = 'https://www.walletlink.org';
class CoinbaseKeyring extends events_1.default {
    constructor(options = {}) {
        super();
        _CoinbaseKeyring_instances.add(this);
        _CoinbaseKeyring_accounts.set(this, void 0);
        _CoinbaseKeyring_sessions.set(this, {});
        this.type = TYPE;
        __classPrivateFieldSet(this, _CoinbaseKeyring_accounts, [], "f");
        /* istanbul ignore next: It's not possible to write a unit test for this, because a constructor isn't allowed
         * to be async. Jest can't await the constructor, and when the error gets thrown, Jest can't catch it. */
        this.deserialize(options).catch((error) => {
            throw new Error(`Problem deserializing CoinbaseKeyring ${error.message}`);
        });
    }
    async serialize() {
        return Promise.resolve({
            accounts: __classPrivateFieldGet(this, _CoinbaseKeyring_accounts, "f"),
        });
    }
    async deserialize(options) {
        if (options.accounts) {
            __classPrivateFieldSet(this, _CoinbaseKeyring_accounts, options.accounts, "f");
        }
    }
    setAccountToAdd(account) {
        this.accountToAdd = account.toLowerCase();
    }
    async addAccounts() {
        if (!this.accountToAdd) {
            throw new Error('No account to add');
        }
        if (__classPrivateFieldGet(this, _CoinbaseKeyring_accounts, "f").find((a) => a.toLowerCase() === this.accountToAdd)) {
            const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === this.accountToAdd; });
            if (sessionData) {
                __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'ADDRESS_DUPLICATE');
                sessionData.provider.disconnect();
            }
            throw new Error("The address you're are trying to import is duplicate");
        }
        __classPrivateFieldGet(this, _CoinbaseKeyring_accounts, "f").push(this.accountToAdd);
        return Promise.resolve(__classPrivateFieldGet(this, _CoinbaseKeyring_accounts, "f"));
    }
    async getAccounts() {
        return Promise.resolve(__classPrivateFieldGet(this, _CoinbaseKeyring_accounts, "f"));
    }
    async signTransaction(address, transaction) {
        var _a;
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        if (!sessionData) {
            throw new Error('No session data found');
        }
        const { provider } = sessionData;
        const txData = {
            to: (_a = transaction.to) === null || _a === void 0 ? void 0 : _a.toString(),
            value: `0x${transaction.value.toString('hex')}`,
            data: `0x${transaction.data.toString('hex')}`,
            nonce: `0x${transaction.nonce.toString('hex')}`,
            gasLimit: `0x${transaction.gasLimit.toString('hex')}`,
            gasPrice: `0x${transaction.gasPrice
                ? transaction.gasPrice.toString('hex')
                : transaction
                    .maxFeePerGas.toString('hex')}`,
        };
        const tx = await provider.request({
            method: 'eth_sendTransaction',
            params: [txData],
        });
        return tx;
    }
    async signMessage(address, message) {
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        if (!sessionData) {
            throw new Error('No session data found');
        }
        const { provider } = sessionData;
        const response = await provider.request({
            method: 'eth_sign',
            params: [address, message],
        });
        return response;
    }
    // For personal_sign, we need to prefix the message:
    async signPersonalMessage(address, msgHex) {
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        if (!sessionData) {
            throw new Error('No session data found');
        }
        const { provider } = sessionData;
        const response = await provider.request({
            method: 'personal_sign',
            params: [msgHex, address],
        });
        return response;
    }
    // personal_signTypedData, signs data along with the schema
    async signTypedData(address, typedData, opts = {
        version: 'V1',
    }) {
        var _a, _b;
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        if (!sessionData) {
            throw new Error('No session data found');
        }
        const { provider } = sessionData;
        const method = `eth_signTypedData_${(_b = (_a = opts.version) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : 'v1'}`;
        const response = await provider.request({
            method,
            params: opts.version === 'V1' ? [[typedData], address] : [address, typedData],
        });
        return response;
    }
    removeAccount(address) {
        __classPrivateFieldSet(this, _CoinbaseKeyring_accounts, __classPrivateFieldGet(this, _CoinbaseKeyring_accounts, "f").filter((account) => account.toLowerCase() !== address.toLowerCase()), "f");
        Object.entries(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find(([_, sessionData]) => {
            var _a;
            if (((_a = sessionData.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase()) {
                sessionData.provider.disconnect();
                return true;
            }
            return false;
        });
    }
    connect(opts) {
        const options = Object.assign({ appName: 'Lux', appIcon: 'https://static-assets.lux.io/files/122da969-da58-42e9-ab39-0a8dd38d94b8.png' }, opts);
        const { provider, relay } = __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_initRelay).call(this, options);
        provider.on('disconnect', () => {
            const sessionData = __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[relay.session.id];
            if (sessionData) {
                __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'DISCONNECTED');
            }
        });
        provider.on('accountsChanged', (accounts) => {
            var _a;
            const sessionData = __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[relay.session.id];
            if (!sessionData) {
                return;
            }
            const account = accounts[0];
            if (sessionData.account) {
                if (((_a = sessionData.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== account.toLowerCase()) {
                    __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'ACCOUNT_ERROR');
                    return;
                }
                if (sessionData.status !== 'CONNECTED') {
                    __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'CONNECTED');
                }
            }
        });
        provider.on('chainChanged', (chainId) => {
            const sessionData = __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[relay.session.id];
            if (sessionData === null || sessionData === void 0 ? void 0 : sessionData.account) {
                sessionData.chainId = chainId;
                __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'CHAIN_CHANGED');
            }
        });
        provider.on('message', (info) => {
            console.log('message', info);
        });
        provider
            .request({
            method: 'eth_requestAccounts',
        })
            .then((accounts) => {
            const sessionData = __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[relay.session.id];
            const account = accounts[0];
            if (sessionData) {
                if ((opts === null || opts === void 0 ? void 0 : opts.address) &&
                    opts.address.toLowerCase() !== account.toLowerCase()) {
                    sessionData.account = opts.address;
                    __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'ACCOUNT_ERROR');
                    this.closeConnector({ address: sessionData.account }, true);
                    return;
                }
                sessionData.account = account;
                __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'CONNECTED');
            }
        })
            .catch((error) => {
            delete __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[relay.session.id];
            console.error(error);
        });
        return provider.qrUrl;
    }
    getSessionStatus(address) {
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        return sessionData === null || sessionData === void 0 ? void 0 : sessionData.status;
    }
    getSessionAccount(address) {
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        return {
            chainId: sessionData === null || sessionData === void 0 ? void 0 : sessionData.chainId,
            account: sessionData === null || sessionData === void 0 ? void 0 : sessionData.account,
            status: sessionData === null || sessionData === void 0 ? void 0 : sessionData.status,
        };
    }
    closeConnector({ address }, silent) {
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        if (sessionData) {
            sessionData.provider.disconnect();
            sessionData.status = 'DISCONNECTED';
            delete __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[sessionData.id];
            if (!silent) {
                __classPrivateFieldGet(this, _CoinbaseKeyring_instances, "m", _CoinbaseKeyring_emit).call(this, sessionData, 'DISCONNECTED');
            }
        }
    }
    async switchEthereumChain(_, chainId, address) {
        const sessionData = Object.values(__classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")).find((data) => { var _a; return ((_a = data.account) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === address.toLowerCase(); });
        if (sessionData) {
            sessionData.provider
                .request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: (0, utils_1.numberToHex)(chainId),
                    },
                ],
            })
                .catch((error) => {
                console.error(error);
            });
        }
    }
}
exports.default = CoinbaseKeyring;
_CoinbaseKeyring_accounts = new WeakMap(), _CoinbaseKeyring_sessions = new WeakMap(), _CoinbaseKeyring_instances = new WeakSet(), _CoinbaseKeyring_initRelay = function _CoinbaseKeyring_initRelay(opts) {
    const relayEventManager = new WalletSDKRelayEventManager_1.WalletSDKRelayEventManager();
    const id = (0, uuid_1.v4)();
    const storage = new storage_1.MemoryStorage(`coinbase:${id}`);
    const defaultRelayOptions = {
        linkAPIUrl: exports.LINK_API_URL,
        version: version_1.LIB_VERSION,
        darkMode: false,
        storage,
        relayEventManager,
        uiConstructor: () => new relay_ui_1.HeadlessUI(),
        reloadOnDisconnect: false,
    };
    const defaultChainId = 1;
    const relay = new WalletLinkRelay_1.WalletLinkRelay(defaultRelayOptions);
    const provider = new CoinbaseWalletProvider_1.CoinbaseWalletProvider({
        relayProvider: async () => Promise.resolve(relay),
        relayEventManager,
        storage,
        jsonRpcUrl: '',
        chainId: defaultChainId,
        qrUrl: relay.getQRCodeUrl(),
        overrideIsCoinbaseWallet: true,
        overrideIsCoinbaseBrowser: true,
        overrideIsMetaMask: true,
    });
    relay.setAppInfo(opts.appName, opts.appIcon);
    __classPrivateFieldGet(this, _CoinbaseKeyring_sessions, "f")[relay.session.id] = {
        provider,
        status: 'DISCONNECTED',
        chainId: defaultChainId,
        id: relay.session.id,
    };
    return { relay, provider };
}, _CoinbaseKeyring_emit = function _CoinbaseKeyring_emit(sessionData, status, payload) {
    sessionData.status = status;
    this.emit('message', Object.assign(Object.assign({}, payload), { status, account: sessionData === null || sessionData === void 0 ? void 0 : sessionData.account, chainId: sessionData.chainId, address: sessionData === null || sessionData === void 0 ? void 0 : sessionData.account, brandName: TYPE }));
};
CoinbaseKeyring.type = TYPE;
//# sourceMappingURL=coinbase-keyring.js.map