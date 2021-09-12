import { ethers } from 'ethers';
import qs from 'qs';
// import { getEnv } from '@/utils/config';

export default class Client {
  constructor({ url, explorer }) {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.explorer = new Explorer(explorer);
  }

  async getAccount(address) {
    const balance = await this.provider.getBalance(address);
    const code = await this.provider.getCode(address);
    const codeHash = ethers.utils.keccak256(code);
    return { balance, codeHash };
  }

  async executeContract(address, abi, method, parameters = [], overrides = {}) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    const tx = await contract[method](...parameters, overrides);
    return tx;
  }

  async approve(address, abi, opAddress, amount) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    const txHash = contract.functions.approve(opAddress, amount);
    return txHash;
  }

  async swap(address, abi, amount) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    const txHash = contract.functions.swap(amount);
    return txHash;
  }

  async stake(address, abi, pid) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    const txHash = contract.functions.stake(pid);
    return txHash;
  }

  async harvest(address, abi, pid, index) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    const txHash = contract.functions.harvest(pid, index);
    return txHash;
  }

  async forceWithdraw(address, abi, pid, index) {
    const contract = new ethers.Contract(address, abi, this.provider.getSigner());
    const txHash = contract.functions.forceWithdraw(pid, index);
    return txHash;
  }

  getBalance = async(address, tokenAddress, abi, unit) => {
    let balance = null;
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    await contract.functions.balanceOf(address).then(async(res) => {
      balance = ethers.utils.formatUnits(res.toString(), unit);
    });
    return balance;
  }

  getName = async(address, abi) => {
    let name = null;
    const contract = new ethers.Contract(address, abi, this.provider);
    await contract.functions.name().then(async(res) => {
      name = res.toString();
    });
    return name;
  }

  getAllowance = async(address, tokenAddress, optAddress, abi, unit) => {
    let allowance = null;
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    await contract.functions.allowance(address, optAddress).then(async(res) => {
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

  async getTransactions(address, page, size) {
    const result = await this.explorer.getHistory(address, page, size);
    return {
      length: 0,
      list: result.result
    };
  }

  // eslint-disable-next-line class-methods-use-this
  parseUnits(ether, num) {
    return ethers.utils.parseUnits(ether, num);
  }

  // eslint-disable-next-line class-methods-use-this
  formatUnits(ether, num) {
    return ethers.utils.formatUnits(ether, num);
  }

  // eslint-disable-next-line class-methods-use-this
  parseEther(ether) {
    return ethers.utils.parseEther(ether);
  }
}

class Explorer {
  constructor(url) {
    this.url = url;
  }

  async getHistory(address, page = 0, size = 10) {
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
