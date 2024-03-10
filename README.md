
# ASTAR zKatana Starter-Kit

This starter helps to quick start developing on zKatana.
Please visit the public [website](https://raas.gelato.network/rollups/details/public/zkatana) and the [Block explorer](https://zkatana.blockscout.com/)

## Funding
You would need Sepolia test Eth. Please go to one of these faucets and grab some eth:

- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [pow Faucet](https://sepolia-faucet.pk910.de/)

Once you have Sepolia Eth you will have to [bridge](https://bridge.zkatana.gelato.digital/) to zKatana eth. Please login in on Sepolia chain and brigde the required amount, it will take 8-10 minuts to confirm.

<img src="./docs/bridge.png" width="400">

## Getting Started

1. Install project dependencies:
```
yarn install
```
in our package.json we have already included zkatana-gelato-protocol-kit
the 
2. Create a `.env` file with your private config:
```
cp .env.example .env
```
You will need to input your Private Key `PK` and `GELATO_RELAY_API_KEY` for sponsored transactions, you an get it at [https://relay.gelato.network](https://relay.gelato.network)



## Account Abstraction (AA)

As part of the Gelato Raas AA offerings, we have deployed a custom safe-sdk creating following packages

| Package| SDK |
| --- | ----------- |
| Safe Protocol Kit | zkatana-gelato-protocol-kit|
| Safe AA Kit | zkatana-gelato-account-abstraction-kit|
| Safe Relay Kit | zkatana-gelato-relay-kit|

In the [Raas AA UI starter Kit](https://github.com/gelatodigital/gelato-raas-aa-ui-starter) we showcase how to implement AA with web3Auth for social login, Safe as smart contract wallet and Gelato Relay for Gasless transactions.
A live demo on zKatana can be seen here:
 [https://raas-ui-starter.web.app/](https://raas-ui-starter.web.app/)
 
Here we are going to show the two different ways to send Gasless Transactions through a Safe, either sponsoring the gas with [1Balance](https://docs.gelato.network/developer-services/1balance) or paying with the Safe balance (SyncFee) 

In both examples we are going to `increment()`the counter on this simple contract deployed on zKatana [https://zkatana.blockscout.com/address/0x47A9064a8D242860ABb43FC8340B3680487CC088?tab=read_contract](https://zkatana.blockscout.com/address/0x47A9064a8D242860ABb43FC8340B3680487CC088?tab=read_contract)

### Using 1Balance

```typescript
const safeAccountAbstraction = new AccountAbstraction(signer);
  const sdkConfig: AccountAbstractionConfig = {
    relayPack,
  };
  await safeAccountAbstraction.init(sdkConfig);

  // Create a transaction object
  const txConfig = {
    TO: targetAddress,
    DATA:counterContract.interface.encodeFunctionData("increment", []),
    // Options:
    GAS_LIMIT: gasLimit,
    VALUE:"0"
  };

  const predictedSafeAddress = await safeAccountAbstraction.getSafeAddress();
  console.log({ predictedSafeAddress });

  const isSafeDeployed = await safeAccountAbstraction.isSafeDeployed();
  console.log({ isSafeDeployed });

  const safeTransactions: MetaTransactionData[] = [
    {
      to: txConfig.TO,
      data: txConfig.DATA,
      value: txConfig.VALUE,
      operation: OperationType.Call,
    },
  ];
  const options: MetaTransactionOptions = {
    gasLimit: txConfig.GAS_LIMIT,
    isSponsored: true,
  };

  const response = await safeAccountAbstraction.relayTransaction(
    safeTransactions,
    options
  );
  console.log(`https://relay.gelato.digital/tasks/status/${response} `);
```
**Output**
```shell
$ ts-node src/aa-safe-gasless/aa1Balance.ts
{ predictedSafeAddress: '0x68D60c586763879c6614e2eFA709cCae708203c4' }
{ isSafeDeployed: true }
https://relay.gelato.digital/tasks/status/0xc34f62e1b057b298c144c79b3cc16e4e24bc2b1e91ce5cd7660f9b8c1791be91 
```

### Using  SyncFee  
Remember to fund your Safe as the gas fees will be deducted from your safe balance

```typescript

  const gasLimit = "10000000";
  
  const safeAccountAbstraction = new AccountAbstraction(signer);
  const sdkConfig: AccountAbstractionConfig = {
    relayPack,
  };
  await safeAccountAbstraction.init(sdkConfig);

  const txConfig = {
    TO: targetAddress,
    DATA: counterContract.interface.encodeFunctionData("increment", []),,
    VALUE: "0",
    // Options:
    GAS_LIMIT: gasLimit,
    GAS_TOKEN: ethers.constants.AddressZero,
  };

  const predictedSafeAddress = await safeAccountAbstraction.getSafeAddress();
  console.log({ predictedSafeAddress });

  const isSafeDeployed = await safeAccountAbstraction.isSafeDeployed();
  console.log({ isSafeDeployed });

  const safeTransactions: MetaTransactionData[] = [
    {
      to: txConfig.TO,
      data: txConfig.DATA,
      value: txConfig.VALUE,
      operation: OperationType.Call,
    },
  ];
  const options: MetaTransactionOptions = {
    gasLimit: txConfig.GAS_LIMIT,
    gasToken: txConfig.GAS_TOKEN,
    isSponsored: false,
  };

  const response = await safeAccountAbstraction.relayTransaction(
    safeTransactions,
    options
  );
  console.log(`https://relay.gelato.digital/tasks/status/${response} `);
```

  **Output**
  ```shell
 $ ts-node src/aa-safe-gasless/aaSyncFee.ts
{ predictedSafeAddress: '0x68D60c586763879c6614e2eFA709cCae708203c4' }
{ isSafeDeployed: true }
https://relay.gelato.digital/tasks/status/0x6590f89386d9adb8a6d20ba7dffaa17958d4e66d49e6a0d3b5b1c144022abbc1 
  ```

## Working with Safes

We have deployed and verified the the Safe contracts and also we forked the safe sdk to be able to test in ASTAR zKatana. 
The forked safe-sdk is published under the package  **zkatana-gelato-protocol-kit@1.3.1**. The relay-kit and account.abstraction-kit will be published very soon.



### Create a Safe
Code can be seen [here](./src/safe/create-safe.ts#L19) 

```shell
yarn create-safe
```

```shell
yarn run v1.22.19
$ ts-node src/create-safe.ts
Network:  { chainId: 1261120, name: 'unknown' }
Safe created with address:  0x881C6d3319a825643dCf95437FcD34BD67481d8e
✨  Done in 13.27s.
```

### Increment counter
We have deployed a [SimpleCounter](https://zkatana.blockscout.com/address/0x47A9064a8D242860ABb43FC8340B3680487CC088) contract  where we are going to increment the counter through a safe transaciton.
Here the [code](./src/safe/increment-counter.ts#L35) 

```shell
yarn increment-counter
```

```shell
$ ts-node src/increment-counter.ts
TxHash:  0xce9271aba30a6e68a36f3ce75690ea63e2258d7d9a1d2bb69d58b10ae4fd70d7
✨  Done in 15.47s.
```

## Verify Contracts with api
We have deployed the contract [SimpleCounterUser](./contracts/SimpleCounterUser.sol) at [https://zkatana.blockscout.com/address/0x00D76203b92ec96bB46d252e3A30660D6a9bD319](https://zkatana.blockscout.com/address/0x00D76203b92ec96bB46d252e3A30660D6a9bD319) and verified using axios post api call following the script [verify-api](./src/utils/verify-api.ts).

```typescript
async function verify() {
  let contractaddress = "0x00D76203b92ec96bB46d252e3A30660D6a9bD319";
  axios
    .post("https://zkatana.blockscout.com/api?module=contract&action=verify", {
      addressHash: contractaddress,
      compilerVersion: "v0.8.18+commit.87f61d96",
      contractSourceCode: `// SPDX-License-Identifier: MIT
      pragma solidity 0.8.18;
      
      contract SimpleCounterUser {
          uint256 public counter;
          mapping(address=> uint) public incrementsByUser;
          event IncrementCounter(uint256 newCounterValue, address msgSender);
      
          function increment() external {
              counter++;
              incrementsByUser[msg.sender]++;
              emit IncrementCounter(counter, msg.sender);
          }
      }`,
      name: "SimpleCounterUser",
      optimization: true,
      runs:200

    })
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
}
verify();
```
The contract was verified successfully

## 実際に動かした記録

コンパイル

```bash
yarn compile
```

```bash
Generating typings for: 2 artifacts in dir: typechain for target: ethers-v5
Successfully generated 8 typings!
Compiled 2 Solidity files successfully
✨  Done in 4.96s.
```

テスト

```bash
yarn test
```

```bash
0 passing (0ms)

✨  Done in 5.00s.
```

デプロイ

```bash
yarn deploy
```

デプロイした記録

```bash
Nothing to compile
No need to generate any newer typings.
Deploying SimpleCounter to zKatana. Hit ctrl + c to abort
reusing "SimpleCounter" at 0x47A9064a8D242860ABb43FC8340B3680487CC088
Deploying SimpleCounter to zKatana. Hit ctrl + c to abort
reusing "SimpleCounterUser" at 0x00D76203b92ec96bB46d252e3A30660D6a9bD319
✨  Done in 3.24s.
```

[SimpleCounter](https://zkatana.blockscout.com/address/0x47A9064a8D242860ABb43FC8340B3680487CC088)

[SimpleCounterUser](https://zkatana.blockscout.com/address/0x00D76203b92ec96bB46d252e3A30660D6a9bD319?tab=txs)

Verify

```bash
yarn verify-api
```

実行結果

```json
{
  message: 'OK',
  result: {
    ABI: '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newCounterValue","type":"uint256"},{"indexed":false,"internalType":"address","name":"msgSender","type":"address"}],"name":"IncrementCounter","type":"event"},{"inputs":[],"name":"counter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"increment","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"incrementsByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',
    CompilerVersion: 'v0.8.18+commit.87f61d96',
    ContractName: 'SimpleCounterUser',
    EVMVersion: 'default',
    FileName: '',
    IsProxy: 'false',
    OptimizationRuns: 200,
    OptimizationUsed: 'true',
    SourceCode: '// SPDX-License-Identifier: MIT\n' +
      '      pragma solidity 0.8.18;\n' +
      '      \n' +
      '      contract SimpleCounterUser {\n' +
      '          uint256 public counter;\n' +
      '          mapping(address=> uint) public incrementsByUser;\n' +
      '          event IncrementCounter(uint256 newCounterValue, address msgSender);\n' +
      '      \n' +
      '          function increment() external {\n' +
      '              counter++;\n' +
      '              incrementsByUser[msg.sender]++;\n' +
      '              emit IncrementCounter(counter, msg.sender);\n' +
      '          }\n' +
      '      }',
    Address: '0x00d76203b92ec96bb46d252e3a30660d6a9bd319'
  },
  status: '1'
}
```

Safeウォレットを作成する。

```bash
yarn create-safe
```

```bash
$ ts-node src/safe/create-safe.ts
Network:  { chainId: 1261120, name: 'unknown' }
Safe created with address:  0x43C2E83791fF68F6aFC58806aAa497bFa5D36Df7
✨  Done in 15.65s.
```

`increment-counter.ts`ファイルのsafeAddressの部分を上記のアドレスに変換すること

Safeウォレット越しにトランザクションを呼び出す

```bash
yarn increment-counter
```

実行結果

```bash
TxHash:  0x64ff1df85d16c4862944023b00f24357d2769e9bb2331766c80ee963a575c2c0
✨  Done in 14.26s.
```

[0x64ff1df85d16c4862944023b00f24357d2769e9bb2331766c80ee963a575c2c0](https://zkatana.blockscout.com/tx/0x64ff1df85d16c4862944023b00f24357d2769e9bb2331766c80ee963a575c2c0)


ガスレスでincrementメソッドを呼び出す。
※ ガス代は Gelatoの1Balanceから引かれる。


```bash
yarn aa1Balance
```

```bash
{ predictedSafeAddress: '0x43C2E83791fF68F6aFC58806aAa497bFa5D36Df7' }
{ isSafeDeployed: true }
https://relay.gelato.digital/tasks/status/0x953212322b62f6cbb4d30b11732544085b6b699d91b3e5216326a0316f2f790c 
✨  Done in 13.58s.
```

[0x3bdd75d795c0169fc488827e9b41281ba63255d7df4322670116873acc93aba8](https://zkatana.blockscout.com/tx/0x3bdd75d795c0169fc488827e9b41281ba63255d7df4322670116873acc93aba8)


さらに別の呼び出し方

```bash
yarn aaSyncFee
```


```bash
{ predictedSafeAddress: '0x43C2E83791fF68F6aFC58806aAa497bFa5D36Df7' }
{ isSafeDeployed: true }
https://relay.gelato.digital/tasks/status/0x46d1c90c725b06df8398226a8063878962c9e2b57a6c3d5dd8b4e2670c5de3bb 
✨  Done in 20.47s.
```

### 参考文献
1. [Gelato relay dashboard](https://app.gelato.network/relay)