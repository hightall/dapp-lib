declare module 'qs';
declare module 'ethers';

declare type NetworkConfig = {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    },
    rpcUrls: string[];
    blockExplorerUrls: string[];
}

declare type Network = {
    id: string;
    name: string;
    chainId: string;
    url: string;
    explorer: string;
    config: NetworkConfig;
}

interface Window {
    ethereum: any;
    BinanceChain: any;
}

declare type BrowserExtensionProps = {
    wallet?: any;
    name: string;
    ethereum?: any;
    enabled?: boolean;
    connector?: any;
}

declare type WalletProps = {
    wallet?: any;
    ethereum?: any;
    connector?: any;
}

declare type WalletConnectProps = WalletProps & {
    providerOptions?: any;
}

declare type WalletAccount = {
    address: string;
}

declare interface BrowserExtension {
    _enabled: boolean;
    _currentAccount?: WalletAccount;
    _chainId?: string;
    _onNetworkChanged?: (network: string) => void;
    _onEnabled?: (account: WalletAccount) => void;
    _accounts?: WalletAccount[];
    _onAccountChanged?: (account: WalletAccount) => void;
    ethereum?: any;
    wallet?: any;
    name: string;
    connector?: any;

    // constructor(props: BrowserExtensionProps);

    // whether extension is enabled
    readonly isEnabled: boolean;

    // get the chain id of network
    readonly chainId: string;

    readonly currentAccount: WalletAccount | undefined;

    onNetworkChanged?: (callback: any) => void;

    onAccountChanged?: (callback: any) => void;

    onDisconnect?: (callback: any) => void;

    onEnabled: (callback: any) => void;

    enable?: (networkEnv: string) => Promise<string>;

    dispose?: () => void;

    setEnabled: (enabled: boolean) => void;

    signMessage?: (message: string) => void;

    signTypedData?: (data: any) => void;

    sendTransaction?: (tx: any) => void;

    getNetwork: (chainId?: string) => any;

    getAllAccounts?: () => Promise<WalletAccount[] | undefined>;
}

declare type ClientProps = {
    url: string;
    explorer: string;
}

declare type DappProps = {
    extension: string;
    availableNetworks?: Network[];
    providerOptions?: any;
}