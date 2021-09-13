import networks from '../networks';
import BaseBrowserExtension from "./BaseBrowserExtension";

export default class MetaMask extends BaseBrowserExtension {
  constructor(walletProps: WalletProps) {
    const props: BrowserExtensionProps = {
      name: 'MetaMask',
    }
    if (walletProps?.ethereum && walletProps?.ethereum.isMetaMask) {
      props.ethereum = walletProps?.ethereum;
    }
    super(props);
  }

  async enable(networkId = 'main') {
    if (this.ethereum) {
      const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
      this._currentAccount = { address: accounts[0] };
      const networkConfig = networks.filter((network) => network.id === networkId);
      // console.log(networkConfig);
      if (networkConfig.length > 0) {
        await this.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig[0].config]
        });
      }
      // console.log(this.ethereum.selectedAddress);
      this._chainId = await this.ethereum.request({ method: 'eth_chainId' });
      // console.log(this._chainId);
      // this._chainId = '0x38';

      this.ethereum.on('chainChanged', (chainId: string) => {
        this._chainId = chainId;
        this._onNetworkChanged && this._onNetworkChanged(this.getNetwork());
      });
      this.ethereum.on('accountsChanged', (accounts: string[]) => {
        this._currentAccount = { address: accounts[0] };
        this._onAccountChanged && this._onAccountChanged({ address: accounts[0] });
      });

      this.setEnabled(true);
      this._onEnabled && this._onEnabled({ address: accounts[0] });
      return this._chainId;
    }
    return this._chainId;
  }

  dispose() {
    this.ethereum.removeAllListeners('chainChanged');
    this.ethereum.removeAllListeners('accountsChanged');
  }

  public async getAllAccounts() {
    const result = await this.ethereum.request({ method: 'wallet_getPermissions' });
    const found = result[0].caveats.find((c: any) => c.type === 'filterResponse');
    this._accounts = (found ? found.value : []).map((address: string) => ({ address }));
    return this._accounts;
  }

  onAccountChanged(callback: any) {
    this._onAccountChanged = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onAccountChanged = undefined;
  }

  async signMessage(message: string) {
    return this.ethereum.request({ method: 'eth_sign', params: [this.currentAccount?.address, message] });
  }

  async signTypedData(typedData: any) {
    return this.ethereum.request({
      method: 'eth_signTypedData',
      params: [typedData, this.currentAccount?.address],
      from: this.currentAccount?.address
    });
  }

  async sendTransaction(tx: any) {
    return this.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });
  }

  onNetworkChanged(callback: any) {
    this._onNetworkChanged = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onNetworkChanged = undefined;
  }

  onDisconnect(callback: any) {
    this._onDisconnect = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onDisconnect = undefined;
  }
}
