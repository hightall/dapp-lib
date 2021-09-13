# Dapp Library

## Quick Start

npm i @hightall/dapp-lib

## Features

support multiple wallet client:

1. metamask
2. walletconnect

## Examples

### MetaMask

```js
import Dapp from '@hightall/dapp-lib'

const options = {
    extension: 'MetaMask'
}
const dapp = new Dapp(options);
try {
    await dapp.enableBrowserExtension('test');
} catch (e) {
    console.log(e);
}
if (dapp.currentAccount && dapp.currentAccount.address) {
    window.dapp = dapp;
    localStorage.setItem('connect-method', connectMethod);
    const balance = await dapp.getBalance(dapp.currentAccount.address, window.racaAddress, v2Abi, 18);
    localStorage.setItem('balance', balance)
    window.location.reload();
}
```

### Wallet Connect

```js
import Dapp from '@hightall/dapp-lib'

const options = {
    extension: 'WalletConnect',
    providerOptions: {
        rpc: {
            97: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
            56: 'https://bsc-dataseed.binance.org/'
        },
        chainId: window.networkEnv === 'main' ? 56 : 97
    }
}
const dapp = new Dapp(options);
try {
    await dapp.enableBrowserExtension('test');
} catch (e) {
    console.log(e);
}
if (dapp.currentAccount && dapp.currentAccount.address) {
    window.dapp = dapp;
    localStorage.setItem('connect-method', connectMethod);
    const balance = await dapp.getBalance(dapp.currentAccount.address, window.racaAddress, v2Abi, 18);
    localStorage.setItem('balance', balance)
    window.location.reload();
}
```

supported wallet constructor options is:

1. extension: the type of the browser extension name
2. networks: the networks which is the pool for connect.
3. providerOptions: this is options for wallet connect, means that which network you will choose.

## Sample Code

The sample code github address is: https://github.com/hightall/dapp-buy-example