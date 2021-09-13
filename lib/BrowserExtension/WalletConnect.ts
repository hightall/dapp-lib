
import WalletConnectProvider from '@walletconnect/web3-provider';
import BaseBrowserExtension from './BaseBrowserExtension';

// import networks from '../networks';

export default class WalletConnect extends BaseBrowserExtension {
  constructor(walletProps: WalletConnectProps) {
    const props: BrowserExtensionProps = {
      name: 'WalletConnect',
      connector: new WalletConnectProvider(walletProps?.providerOptions)
    }
    super(props);
  }

  async enable(networkId = 'main') {
    await this.connector.enable();
    const accounts = this.connector.accounts;
    this._currentAccount = { address: accounts[0] };
    this._chainId = `0x${this.connector.chainId.toString(16)}`;
    // Subscribe to accounts change
    this.connector.on('accountsChanged', (accounts: string[]) => {
      this._currentAccount = { address: accounts[0] };
      this._onAccountChanged && this._onAccountChanged({ address: accounts[0] });
    });
    // Subscribe to chainId change
    this.connector.on('chainChanged', (chainId: string) => {
      console.log(chainId);
      this._chainId = chainId;
      this._onNetworkChanged && this._onNetworkChanged(this.getNetwork());
    });
    // Subscribe to session disconnection
    this.connector.on('disconnect', async(code: number, reason: string) => {
      // console.log(code, reason);
      this._onDisconnect && this._onDisconnect();
    });
    this._enabled = true;
    this._onEnabled && this._onEnabled({ address: accounts[0] });
    return this._chainId;
  }

  async sendTransaction(tx: any) {
    return this.connector.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });
  }
}
