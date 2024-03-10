import { ethers } from "ethers";
// import { GelatoRelayPack } from "gelato-relay-kit";
import Safe, {
  EthersAdapter,
  getSafeContract,
} from "zkatana-gelato-protocol-kit";
import {
  MetaTransactionData,
  OperationType,
} from "@safe-global/safe-core-sdk-types";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

import ContractInfo from "../../deployments/zKatana/SampleNFT.json";

let RPC_URL = "https://rpc.zkatana.gelato.digital";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);

let safeAddress = "0x43C2E83791fF68F6aFC58806aAa497bFa5D36Df7";

const targetAddress = ContractInfo.address;

const nftContract = new ethers.Contract(
  targetAddress,
  ContractInfo.abi,
  signer
);


/**
 * NFTをミントするメソッド
 * ガス代あり版
 */
async function mintNFT() {


  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });


  const safeSDK = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  const safeTransactionData: MetaTransactionData = {
    to: targetAddress,
    data: nftContract.interface.encodeFunctionData("mint", [signer.address, 0, 1, "0x"]),
    value: "0",
    operation: OperationType.Call
  };


  const standardizedSafeTx = await safeSDK.createTransaction({
    safeTransactionData,
  });



  const safeSingletonContract = await getSafeContract({
    ethAdapter: ethAdapter,
    safeVersion: await safeSDK.getContractVersion(),
  });

  const signedSafeTx = await safeSDK.signTransaction(standardizedSafeTx);

  const encodedTx = safeSingletonContract.encode("execTransaction", [
    signedSafeTx.data.to,
    signedSafeTx.data.value,
    signedSafeTx.data.data,
    signedSafeTx.data.operation,
    signedSafeTx.data.safeTxGas,
    signedSafeTx.data.baseGas,
    signedSafeTx.data.gasPrice,
    signedSafeTx.data.gasToken,
    signedSafeTx.data.refundReceiver,
    signedSafeTx.encodedSignatures(),
  ]);

  let tx = await signer.sendTransaction({
    value: 0,
    to: safeAddress,
    data: encodedTx,
    gasLimit: 1000000,
  });

  await tx.wait();

  console.log('TxHash: ',tx.hash)

}

mintNFT();
