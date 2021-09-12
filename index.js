import networks from './networks';
import BinanceChainWallet from './BrowserExtension/BinanceChainWallet';
import MetaMask from './BrowserExtension/MetaMask';
import TokenPocket from './BrowserExtension/TokenPocket';
import Wallet from './BrowserExtension/WalletConnect';
import Client from './Client';

export default class Dapp {
  constructor(extension, availableNetworks = networks) {
    // eslint-disable-next-line no-underscore-dangle
    this._client = null;
    this._networks = availableNetworks;
    if (!extension) {
      this.initBinanceChainWallet() || this.initMetaMask();
    } else if (extension === 'BinanceChainWallet') {
      this.initBinanceChainWallet();
    } else if (extension === 'MetaMask') {
      this.initMetaMask();
    } else if (extension === 'WalletConnect') {
      this.initWalletConnect();
    } else if (extension === 'TokenPocket') {
      this.initTokenPocket();
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!this._browserExtension) {
      console.warn('Unable to init the dApp. No compatible browser extension is found.');
    }
  }

  // eslint-disable-next-line consistent-return
  initBinanceChainWallet() {
    if (window.BinanceChain && window.BinanceChain.bnbSign) {
      // eslint-disable-next-line no-underscore-dangle
      this._browserExtension = new BinanceChainWallet(window.BinanceChain);
      return this._browserExtension;
    }
  }

  initMetaMask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      // console.log(window.ethereum);
      this._browserExtension = new MetaMask(window.ethereum);
      return this._browserExtension;
    }
  }

  initTokenPocket() {
    if (window.ethereum) {
      // console.log(window.ethereum);
      this._browserExtension = new TokenPocket(window.ethereum);
      return this._browserExtension;
    }
  }

  initWalletConnect() {
    this._browserExtension = new Wallet();
    // change provider for wallet connect
    window.ethereum = this._browserExtension.connector;
    return this._browserExtension;
  }

  get browserExtension() { return this._browserExtension }

  get isBrowserExtensionInstalled() {
    return Boolean(this.browserExtension);
  }

  get isBrowserExtensionEnabled() {
    return this.isBrowserExtensionInstalled && this.browserExtension.isEnabled;
  }

  async enableBrowserExtension(networkId = 'test') {
    let chainId = '';
    // console.log('enable browser extension 1', chainId);
    if (this.isBrowserExtensionInstalled || localStorage.getItem('walletconnect')) {
      // console.log('enable browser extension 2', chainId);
      // console.log('network', chainId);
      chainId = await this.browserExtension.enable(networkId);
      // console.log('enable browser extension 3', chainId);
    }
    // console.log('enable browser extension', chainId);
    this.initRpcFromChainId(chainId);
    return chainId;
  }

  onEnabled(callback) {
    return this.isBrowserExtensionInstalled && this.browserExtension.onEnabled(callback);
  }

  get network() {
    return this.isBrowserExtensionInstalled && this.browserExtension.getNetwork();
  }

  onNetworkChanged(callback) {
    const handler = network => {
      this.initRpcFromChainId(network.chainId);
      callback(network);
    };
    return this.isBrowserExtensionInstalled && this.browserExtension.onNetworkChanged(handler);
  }

  initRpcFromChainId(chainId) {
    if (chainId) {
      const network = this._networks.find(n => n.chainId === chainId);
      if (network) {
        this._client = new Client(network);
      }
    }
  }

  get rpc() { return this._client && this._client.provider }

  get explorer() { return this._client && this._client.explorer }

  get currentAccount() {
    return this.isBrowserExtensionInstalled && this.browserExtension.currentAccount;
  }

  onAccountChanged(callback) {
    return this.isBrowserExtensionInstalled && this.browserExtension.onAccountChanged(callback);
  }

  onDisconnect(callback) {
    return this.isBrowserExtensionInstalled && this.browserExtension.onDisconnect(callback);
  }

  async getAllAccounts() {
    return this.isBrowserExtensionInstalled && this.browserExtension.getAllAccounts();
  }

  async signMessage(message) {
    return this.isBrowserExtensionInstalled && this.browserExtension.signMessage(message);
  }

  async signTypedData(typedData) {
    return this.isBrowserExtensionInstalled && this.browserExtension.signTypedData(typedData);
  }

  async sendTransaction({ from, to, value, ...others }) {
    return this.isBrowserExtensionInstalled && this.browserExtension.sendTransaction({
      from,
      to,
      value: value.toHexString(),
      ...others
    });
  }

  async executeContract(address, abi, method, parameters = [], overrides = {}) {
    return this._client.executeContract(address, abi, method, parameters, overrides);
  }

  async approve(address, abi, opAddress, amount) {
    return this._client.approve(address, abi, opAddress, amount);
  }

  async swap(address, abi, amount) {
    return this._client.swap(address, abi, amount);
  }

  async stake(address, abi, pid) {
    return this._client.stake(address, abi, pid);
  }

  async harvest(address, abi, pid, index) {
    return this._client.harvest(address, abi, pid, index);
  }

  async forceWithdraw(address, abi, pid, index) {
    return this._client.forceWithdraw(address, abi, pid, index);
  }

  getAllowance(address, tokenAddress, optAddress, abi, unit = 18) {
    return this._client.getAllowance(address, tokenAddress, optAddress, abi, unit);
  }

  getBalance(address, tokenAddress, abi, unit = 18) {
    return this._client.getBalance(address, tokenAddress, abi, unit);
  }

  getName(address, abi) {
    return this._client.getName(address, abi);
  }

  pool(pid) {
    return this._client.pool(pid);
  }

  getPoolNFTLeft(pid) {
    return this._client.getPoolNFTLeft(pid);
  }

  getUserStakeHisCnt(address, pid) {
    return this._client.getUserStakeHisCnt(address, pid);
  }

  getUserStakeHis(index, address, pid) {
    return this._client.getUserStakeHis(index, address, pid);
  }

  getAccount(address) {
    return this._client.getAccount(address);
  }

  formatUnits(ether, num = 18) {
    return this._client.formatUnits(ether, num);
  }

  parseEther(ether) {
    return this._client.parseEther(ether);
  }

  parseUnits(ether, num = 18) {
    return this._client.parseUnits(ether, num);
  }
}
