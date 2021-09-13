import networks from './networks';
import MetaMask from './BrowserExtension/MetaMask';
// import Wallet from './BrowserExtension/WalletConnect';
import Client from './Client';
import BaseBrowserExtension from './BrowserExtension/BaseBrowserExtension';

export default class Dapp {
  _client: any;
  _networks: Network[];
  _browserExtension?: MetaMask;

  constructor(extension: string, availableNetworks: Network[] = networks) {
    // eslint-disable-next-line no-underscore-dangle
    this._client = null;
    this._networks = availableNetworks;
    if (!extension || extension === 'MetaMask') {
      this._initMetaMask();
    // } else if (extension === 'WalletConnect') {
    //   this._initWalletConnect();
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!this._browserExtension) {
      console.warn('Unable to init the dApp. No compatible browser extension is found.');
    }
  }

  _initMetaMask() {
    console.log('will init metamask')
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log(window.ethereum);
      this._browserExtension = new MetaMask({
        ethereum: window.ethereum,
      });
      return this._browserExtension;
    }
  }

  // _initWalletConnect() {
  //   this._browserExtension = new Wallet();
  //   // change provider for wallet connect
  //   window.ethereum = this._browserExtension?.connector;
  //   return this._browserExtension;
  // }

  get browserExtension() { return this._browserExtension }

  get isBrowserExtensionInstalled(): boolean {
    return Boolean(this.browserExtension);
  }

  isBrowserExtensionEnabled(): boolean {
    return this.isBrowserExtensionInstalled && (this.browserExtension?.isEnabled() || false);
  }

  async enableBrowserExtension(networkId = 'test') {
    let chainId: string | undefined = '';
    // console.log('enable browser extension 1', chainId);
    if (this.isBrowserExtensionInstalled || localStorage.getItem('walletconnect')) {
      // console.log('enable browser extension 2', chainId);
      // console.log('network', chainId);
      chainId = await this.browserExtension?.enable(networkId);
      // console.log('enable browser extension 3', chainId);
    }
    // console.log('enable browser extension', chainId);
    this.initRpcFromChainId(chainId || '');
    return chainId || '';
  }

  onEnabled(callback: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.onEnabled(callback);
  }

  network() {
    return this.isBrowserExtensionInstalled && this.browserExtension?.getNetwork();
  }

  onNetworkChanged(callback: any) {
    const handler = (network: any) => {
      this.initRpcFromChainId(network.chainId);
      callback(network);
    };
    return this.isBrowserExtensionInstalled && this.browserExtension?.onNetworkChanged(handler);
  }

  initRpcFromChainId(chainId: string) {
    if (chainId) {
      // @ts-ignore
      const network = this._networks.find(n => n.chainId === chainId);
      if (network) {
        this._client = new Client(network);
      }
    }
  }

  rpc() { return this._client && this._client.provider }

  explorer() { return this._client && this._client.explorer }

  currentAccount() {
    return this.isBrowserExtensionInstalled && this.browserExtension?.currentAccount;
  }

  onAccountChanged(callback: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.onAccountChanged(callback);
  }

  onDisconnect(callback: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.onDisconnect(callback);
  }

  async getAllAccounts() {
    return this.isBrowserExtensionInstalled && this.browserExtension?.getAllAccounts();
  }

  async signMessage(message: string) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.signMessage(message);
  }

  async signTypedData(typedData: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.signTypedData(typedData);
  }

  // async sendTransaction({ from, to, value, ...others }) {
  //   return this.isBrowserExtensionInstalled && this.browserExtension?.sendTransaction({
  //     from,
  //     to,
  //     value: value.toHexString(),
  //     ...others
  //   });
  // }

  async executeContract(address: string, abi: any, method: string, parameters = [], overrides = {}) {
    return this._client.executeContract(address, abi, method, parameters, overrides);
  }

  async approve(address: string, abi: any, opAddress: string, amount: any) {
    return this._client.approve(address, abi, opAddress, amount);
  }

  async swap(address: string, abi: any, amount: any) {
    return this._client.swap(address, abi, amount);
  }

  async stake(address: string, abi: any, pid: any) {
    return this._client.stake(address, abi, pid);
  }

  async harvest(address: string, abi: any, pid: any, index: number) {
    return this._client.harvest(address, abi, pid, index);
  }

  async forceWithdraw(address: string, abi: any, pid: any, index: number) {
    return this._client.forceWithdraw(address, abi, pid, index);
  }

  getAllowance(address: string, tokenAddress: string, optAddress: string, abi: any, unit = 18) {
    return this._client.getAllowance(address, tokenAddress, optAddress, abi, unit);
  }

  getBalance(address: string, tokenAddress: string, abi: any, unit = 18) {
    return this._client.getBalance(address, tokenAddress, abi, unit);
  }

  getName(address: string, abi: any) {
    return this._client.getName(address, abi);
  }

  pool(pid: any) {
    return this._client.pool(pid);
  }

  getPoolNFTLeft(pid: any) {
    return this._client.getPoolNFTLeft(pid);
  }

  getUserStakeHisCnt(address: string, pid: any) {
    return this._client.getUserStakeHisCnt(address, pid);
  }

  getUserStakeHis(index: number, address: string, pid: any) {
    return this._client.getUserStakeHis(index, address, pid);
  }

  getAccount(address: string) {
    return this._client.getAccount(address);
  }

  formatUnits(ether: any, num = 18) {
    return this._client.formatUnits(ether, num);
  }

  parseEther(ether: any) {
    return this._client.parseEther(ether);
  }

  parseUnits(ether: any, num = 18) {
    return this._client.parseUnits(ether, num);
  }
}
