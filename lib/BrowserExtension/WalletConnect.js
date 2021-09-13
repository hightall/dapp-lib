
import WalletConnectProvider from '@walletconnect/web3-provider';

// import networks from '../networks';

export default class Wallet {
  constructor(providerOptions = {
    rpc: {
      97: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
      56: 'https://bsc-dataseed.binance.org/'
    },
    chainId: window.networkEnv === 'main' ? 56 : 97,
  }) {
    this.name = 'WalletConnect';
    this._accounts = [];
    this._enabled = false;
    this.connector = new WalletConnectProvider(providerOptions);
    this._chainId = undefined;
    this._onEnabled = undefined;
    this._currentAccount = undefined;
  }

  async enable(networkId = 'main') {
    await this.connector.enable();
    const accounts = this.connector.accounts;
    this._currentAccount = { address: accounts[0] };
    this._chainId = `0x${this.connector.chainId.toString(16)}`;
    // Subscribe to accounts change
    this.connector.on('accountsChanged', (accounts) => {
      this._currentAccount = { address: accounts[0] };
      this._onAccountChanged && this._onAccountChanged({ address: accounts[0] });
    });
    // Subscribe to chainId change
    this.connector.on('chainChanged', (chainId) => {
      console.log(chainId);
      this._chainId = chainId;
      this._onNetworkChanged && this._onNetworkChanged(this.getNetwork());
    });
    // Subscribe to session disconnection
    this.connector.on('disconnect', async(code, reason) => {
      // console.log(code, reason);
      this._onDisconnect && this._onDisconnect();
    });
    this._enabled = true;
    this._onEnabled && this._onEnabled({ address: accounts[0] });
    return this._chainId;
  }

  onEnabled(callback) {
    this._onEnabled = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onEnabled = undefined;
  }

  get chainId() { return this._chainId }

  getNetwork(chainId = this.chainId) {
    return {
      chainId,
      isBscMainnet: chainId === '0x38',
      isBscTestnet: chainId === '0x61'
    };
  }

  onNetworkChanged(callback) {
    this._onNetworkChanged = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onNetworkChanged = undefined;
  }

  get currentAccount() { return this._currentAccount }

  onAccountChanged(callback) {
    this._onAccountChanged = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onAccountChanged = undefined;
  }

  onDisconnect(callback) {
    this._onDisconnect = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onDisconnect = undefined;
  }

  async sendTransaction(tx) {
    return this.connector.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });
  }
}
