import {ethers} from 'ethers';
import qs from 'qs';
// import { getEnv } from '@/utils/config';

export default class Client {
  provider: any;
  explorer: any;

  constructor({ url, explorer }: ClientProps) {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.explorer = new Explorer(explorer);
  }

  async getAccount(address: string) {
    const balance = await this.provider.getBalance(address);
    const code = await this.provider.getCode(address);
    const codeHash = ethers.utils.keccak256(code);
    return { balance, codeHash };
  }

  getUtils(){
    return ethers.utils
  }

  getSigner(){
    return this.provider.getSigner()
  } 

  /**
   * general contract method
   * @param address 
   * @param abi 
   * @param funcName : contract function name 
   * @param args : contract function params
   * @returns contract function execute result
   */
   async runContractTransactionFunc(address: string, abi: any, funcName: string,...args:any[]){
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions[funcName](...args)
  }

  /**
   * general contract method
   * @param address 
   * @param abi 
   * @param funcName : contract function name 
   * @param args : contract function params
   * @returns query result
   */
   async queryContract(address: string, abi: any,funcName:string,...args:any[]){
    const contract = new ethers.Contract(address, abi, this.provider);
    return contract.functions[funcName](...args)
  }

  async executeContract(address: string, abi: any, method: string, parameters = [], overrides = {}) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return await contract[method](...parameters, overrides);
  }

  async approve(address: string, abi: any, opAddress: string, amount: any) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions.approve(opAddress, amount);
  }

  async swap(address: string, abi: any, amount: any) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions.swap(amount);
  }

  async stake(address: string, abi: any, pid: any) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions.stake(pid);
  }

  async harvest(address: string, abi: any, pid: any, index: number) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions.harvest(pid, index);
  }

  async forceWithdraw(address: string, abi: any, pid: any, index: number) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    return contract.functions.forceWithdraw(pid, index);
  }

  getBalance = async(address: string, tokenAddress: string, abi: any, unit: number) => {
    let balance = null;
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    await contract.functions.balanceOf(address).then(async(res: any) => {
      balance = ethers.utils.formatUnits(res.toString(), unit);
    });
    return balance;
  }

  getName = async(address: string, abi: any) => {
    let name = null;
    const contract = new ethers.Contract(address, abi, this.provider);
    await contract.functions.name().then(async(res: any) => {
      name = res.toString();
    });
    return name;
  }

  getAllowance = async(address: string, tokenAddress: string, optAddress: string, abi: any, unit: any) => {
    let allowance = null;
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    await contract.functions.allowance(address, optAddress).then(async(res: any) => {
      allowance = ethers.utils.formatUnits(res.toString(), unit);
    });
    return allowance;
  }

  // pool = async(pid) => {
  //   let poolInfo = null;
  //   const networkId = localStorage.getItem('networkId', 'test');
  //   const contract = new ethers.Contract(getEnv(networkId).StakeAddress, stakeAbi, this.provider);
  //   await contract.functions.pool(pid).then(async(res) => {
  //     poolInfo = res;
  //   });
  //   return poolInfo;
  // }
  //
  // getPoolNFTLeft = async(pid) => {
  //   let PoolNFTLeft = null;
  //   const networkId = localStorage.getItem('networkId', 'test');
  //   const contract = new ethers.Contract(getEnv(networkId).StakeAddress, stakeAbi, this.provider);
  //   await contract.functions.getPoolNFTLeft(pid).then(async(res) => {
  //     PoolNFTLeft = res.toString();
  //   });
  //   return PoolNFTLeft;
  // }
  //
  // getUserStakeHisCnt = async(currentAddress, pid) => {
  //   let stakeHisCnt = null;
  //   const networkId = localStorage.getItem('networkId', 'test');
  //   const contract = new ethers.Contract(getEnv(networkId).StakeAddress, stakeAbi, this.provider);
  //   await contract.functions.getUserStakeHisCnt(pid, currentAddress).then(async(res) => {
  //     stakeHisCnt = res.toString();
  //   });
  //   return stakeHisCnt;
  // }
  //
  // getUserStakeHis = async(index, currentAddress, pid) => {
  //   let stakeHis = null;
  //   const networkId = localStorage.getItem('networkId', 'test');
  //   const contract = new ethers.Contract(getEnv(networkId).StakeAddress, stakeAbi, this.provider);
  //   await contract.functions.getUserStakeHis(pid, currentAddress, index, Date.parse(new Date()) / 1000).then(async(res) => {
  //     stakeHis = res;
  //   });
  //   return stakeHis;
  // }

  async getTransactions(address: string, page: number, size: number) {
    const result = await this.explorer.getHistory(address, page, size);
    return {
      length: 0,
      list: result.result
    };
  }

  // eslint-disable-next-line class-methods-use-this
  parseUnits(ether: any, num: number) {
    return ethers.utils.parseUnits(ether, num);
  }

  // eslint-disable-next-line class-methods-use-this
  formatUnits(ether: any, num: number) {
    return ethers.utils.formatUnits(ether, num);
  }

  // eslint-disable-next-line class-methods-use-this
  parseEther(ether: any) {
    return ethers.utils.parseEther(ether);
  }
}

class Explorer {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getHistory(address: string, page = 0, size = 10) {
    const query = {
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page: page + 1,
      offset: size,
      sort: 'desc'
    };

    const res = await fetch(`${this.url}?${qs.stringify(query)}`);
    const result = await res.json();
    return result;
  }
}
