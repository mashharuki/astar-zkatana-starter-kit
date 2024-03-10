import { ethers } from "ethers";
// import { GelatoRelayPack } from "gelato-relay-kit";
import Safe, {
  EthersAdapter,
  SafeAccountConfig,
  SafeFactory,
} from "zkatana-gelato-protocol-kit";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });


let RPC_URL = "https://rpc.zkatana.gelato.digital";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);

/**
 * Safe Contractを作成するメソッド
 */
async function createSafe() {
  console.log('Network: ',await provider.getNetwork());

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  try {
    // try catch to check id
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [await signer.getAddress()],
      threshold: 1,
      // ... (Optional params)
    };

    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig });

    let safeAddress = await safeSdkOwner1.getAddress();

    console.log("Safe created with address: ", safeAddress);
  } catch (error) {
    console.log(error);
  }
}
createSafe();
