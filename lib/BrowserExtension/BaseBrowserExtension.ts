export default class BaseBrowserExtension implements BrowserExtension {
    _enabled: boolean;
    _currentAccount?: WalletAccount;
    _chainId?: string;
    _onNetworkChanged?: (network: string) => void;
    _onEnabled?: (account: WalletAccount) => void;
    _accounts?: WalletAccount[];
    _onAccountChanged?: (account: WalletAccount) => void;
    _onDisconnect?: any;
    ethereum?: any;
    wallet?: any;
    name: string;
    connector?: any;

    constructor(props: BrowserExtensionProps) {
        this.wallet = props?.wallet;
        this.name = props.name;
        this._enabled = props?.enabled || false;
        this.ethereum = props?.ethereum;
        this.connector = props?.connector;
    }

    get chainId(): string {
        return this._chainId || '';
    }

    get isEnabled(): boolean {
        return this._enabled;
    }

    get currentAccount(): WalletAccount | undefined {
        return this._currentAccount;
    }

    setEnabled(enabled: boolean) {
        this._enabled = enabled;
    }

    onEnabled(callback: any) {
        this._onEnabled = callback;
        // eslint-disable-next-line no-return-assign
        return () => this._onEnabled = undefined;
    }

    onNetworkChanged(callback: any) {
        this._onNetworkChanged = callback;
        // eslint-disable-next-line no-return-assign
        return () => this._onNetworkChanged = undefined;
    }

    onAccountChanged(callback: any) {
        this._onAccountChanged = callback;
        // eslint-disable-next-line no-return-assign
        return () => this._onAccountChanged = undefined;
    }

    onDisconnect(callback: any) {
        this._onDisconnect = callback;
        // eslint-disable-next-line no-return-assign
        return () => this._onDisconnect = undefined;
    }

    getNetwork(chainId: string = this._chainId || ''): any {
        return {
            chainId,
            isBscMainnet: chainId === '0x38',
            isBscTestnet: chainId === '0x61'
        }
    }
}