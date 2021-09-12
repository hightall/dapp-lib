import networks from '../networks';

export default class TokenPocket {
  constructor(ethereum) {
    this.name = 'TokenPocket';
    this._accounts = [];
    this._enabled = false;
    if (ethereum) {
      this.ethereum = ethereum;
      this._chainId = undefined;
      this._chainId = undefined;
      this._onEnabled = undefined;
      this._currentAccount = undefined;
    }
  }

  get isEnabled() { return this._enabled }

  async enable(networkId = 'main') {
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

    this.ethereum.on('chainChanged', chainId => {
      this._chainId = chainId;
      this._onNetworkChanged && this._onNetworkChanged(this.getNetwork());
    });
    this.ethereum.on('accountsChanged', accounts => {
      this._currentAccount = { address: accounts[0] };
      this._onAccountChanged && this._onAccountChanged({ address: accounts[0] });
    });

    this._enabled = true;
    this._onEnabled && this._onEnabled({ address: accounts[0] });
    return this._chainId;
  }

  dispose() {
    this.ethereum.removeAllListeners('chainChanged');
    this.ethereum.removeAllListeners('accountsChanged');
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

  async getAllAccounts() {
    const result = await this.ethereum.request({ method: 'wallet_getPermissions' });
    const found = result[0].caveats.find(c => c.type === 'filterResponse');
    this._accounts = (found ? found.value : []).map(address => ({ address }));
    return this._accounts;
  }

  onAccountChanged(callback) {
    this._onAccountChanged = callback;
    // eslint-disable-next-line no-return-assign
    return () => this._onAccountChanged = undefined;
  }

  async signMessage(message) {
    return this.ethereum.request({ method: 'eth_sign', params: [this.currentAccount.address, message] });
  }

  async signTypedData(typedData) {
    return this.ethereum.request({
      method: 'eth_signTypedData',
      params: [typedData, this.currentAccount.address],
      from: this.currentAccount.address
    });
  }

  async sendTransaction(tx) {
    return this.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });
  }
}
