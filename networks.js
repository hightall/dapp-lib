// const networks = [
//   {
//     id: 'main',
//     config: {
//       chainId: '0x38',
//       chainName: 'Binance Smart Chain',
//       nativeCurrency: {
//         name: 'BNB',
//         symbol: 'BNB',
//         decimals: 18
//       },
//       rpcUrls: ['https://bsc-dataseed.binance.org/'],
//       blockExplorerUrls: ['https://bscscan.com/']
//     }
//   },
//   {
//     id: 'test',
//     config: {
//       chainId: '0x61',
//       chainName: 'BSC Testnet',
//       nativeCurrency: {
//         name: 'BNB',
//         symbol: 'BNB',
//         decimals: 18
//       },
//       rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
//       blockExplorerUrls: ['https://testnet.bscscan.com']
//     }
//   }
// ];

// export default networks;
const networks = [
  {
    id: 'test',
    name: 'BSC Testnet',
    chainId: '0x61',
    url: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    explorer: 'https://testnet.bscscan.com/',
    config: {
      chainId: '0x61',
      chainName: 'BSC Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://data-seed-prebsc-2-s3.binance.org:8545/'],
      blockExplorerUrls: ['https://testnet.bscscan.com/']
    }
  },
  {
    id: 'main',
    name: 'BSC Mainnet',
    chainId: '0x38',
    url: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://bscscan.com/',
    config: {
      chainId: '0x38',
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/']
    }
  }
];

export default networks;

