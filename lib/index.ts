import networks from './networks';
import MetaMask from './BrowserExtension/MetaMask';
import WalletConnect from './BrowserExtension/WalletConnect';
import Client from './Client';

export default class Dapp {
  _client: any;
  _networks: Network[];
  _browserExtension?: MetaMask | WalletConnect;

  constructor(options: DappProps) {
    // eslint-disable-next-line no-underscore-dangle
    const { extension, availableNetworks = networks, providerOptions = {} } = options;
    this._client = null;
    this._networks = availableNetworks;
    if (!extension || extension === 'MetaMask') {
      this._initMetaMask();
    } else if (extension === 'WalletConnect') {
      this._initWalletConnect(providerOptions);
    }

    // eslint-disable-next-line no-underscore-dangle
    if (!this._browserExtension) {
      console.warn('Unable to init the dApp. No compatible browser extension is found.');
    }
  }

  _initMetaMask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      this._browserExtension = new MetaMask({
        ethereum: window.ethereum,
      });
      return this._browserExtension;
    }
  }

  _initWalletConnect(providerOptions: any) {
    this._browserExtension = new WalletConnect({
      providerOptions
    });
    // change provider for wallet connect
    window.ethereum = this._browserExtension?.connector;
    return this._browserExtension;
  }

  get browserExtension() { return this._browserExtension }

  get isBrowserExtensionInstalled(): boolean {
    return Boolean(this.browserExtension);
  }

  get isBrowserExtensionEnabled(): boolean {
    return this.isBrowserExtensionInstalled && (this.browserExtension?.isEnabled || false);
  }

  async enableBrowserExtension(networkId = 'test') {
    let chainId: string | undefined = '';
    if (this.isBrowserExtensionInstalled || localStorage.getItem('walletconnect')) {
      chainId = await this.browserExtension?.enable(networkId);
    }
    this.initRpcFromChainId(chainId || '');
    return chainId || '';
  }

  onEnabled(callback: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.onEnabled(callback);
  }

  get network() {
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

  get rpc() { return this._client && this._client.provider }

  get explorer() { return this._client && this._client.explorer }

  get currentAccount() {
    return this.isBrowserExtensionInstalled && this.browserExtension?.currentAccount;
  }

  onAccountChanged(callback: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.onAccountChanged(callback);
  }

  onDisconnect(callback: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.onDisconnect(callback);
  }

  // async getAllAccounts() {
  //   return this.isBrowserExtensionInstalled && this.browserExtension?.getAllAccounts();
  // }
  //
  async signMessage(message: string) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.signMessage(message);
  }
  
  async signTypedData(typedData: any) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.signTypedData(typedData);
  }  

  async personalSign(message: string) {
    return this.isBrowserExtensionInstalled && this.browserExtension?.personalSign(message);
  }

  // async sendTransaction({ from, to, value, ...others }) {
  //   return this.isBrowserExtensionInstalled && this.browserExtension?.sendTransaction({
  //     from,
  //     to,
  //     value: value.toHexString(),
  //     ...others
  //   });
  // }
  async runContractTransactionFunc(address: string, abi: any, funcName: string,...args:any[]){
    return this._client.runContractTransactionFunc(address, abi, funcName,...args)
  }

  async queryContract(address: string, abi: any,funcName:string,...args:any[]){
    return this._client.queryContract(address, abi,funcName,...args)
  }

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

  getSigner(){
    return this._client.getSigner()
  }

  utils(){
    this._client.getUtils()
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
