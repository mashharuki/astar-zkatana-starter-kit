
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


## Working with Safes

We have deployed and verified the the Safe contracts and also we forked the safe sdk to be able to test in ASTAR zKatana. 
The forked safe-sdk is published under the package  **zkatana-gelato-protocol-kit@1.3.1**. The relay-kit and account.abstraction-kit will be published very soon.

### Getting Started

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
You will need to input your Private Key `PK`




### Create a Safe
Code can be seen [here](./src/create-safe.ts#L19) 

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
Here the [code](./src/increment-counter.ts#L35) 

```shell
yarn increment-counter
```

```shell
$ ts-node src/increment-counter.ts
TxHash:  0xce9271aba30a6e68a36f3ce75690ea63e2258d7d9a1d2bb69d58b10ae4fd70d7
✨  Done in 15.47s.
```

