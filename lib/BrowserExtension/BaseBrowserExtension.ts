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
    }

    setEnabled(enabled: boolean) {
        this._enabled = enabled;
    }

    onEnabled(callback: any) {
        this._onEnabled = callback;
        // eslint-disable-next-line no-return-assign
        return () => this._onEnabled = undefined;
    }

    chainId(): string {
        return this._chainId || '';
    }

    isEnabled(): boolean {
        return this._enabled;
    }

    currentAccount(): WalletAccount | undefined {
        return this._currentAccount;
    }

    getNetwork(chainId: string = this._chainId || ''): any {
        return {
            chainId,
            isBscMainnet: chainId === '0x38',
            isBscTestnet: chainId === '0x61'
        }
    }
}