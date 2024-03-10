import { ethers } from "ethers";

import axios, { AxiosError, AxiosResponse } from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

let RPC_URL = "https://rpc.zkatana.gelato.digital";

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(process.env.PK!, provider);

/**
 * NFTコントラクトをVerifyするためのメソッド
 */
async function verify() {
  let contractaddress = "0x67ADc29278d87D87b212C59fDffd2749fe7418c4";
  axios
    .post("https://zkatana.blockscout.com/api?module=contract&action=verify", {
      addressHash: contractaddress,
      compilerVersion: "v0.8.20",
      contractSourceCode: `
      // SPDX-License-Identifier: MIT
      pragma solidity ^0.8.20;
      
      import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
      import "@openzeppelin/contracts/access/Ownable.sol";
      import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
      import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
      
      /**
       * SampleNFT Contract
       */
      contract SampleNFT is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
        constructor(
          address initialOwner
        )
          ERC1155(
            "https://bafybeihd5jasbp6spqqapd6jzy7zfosiukwqbx4capmhayjt3yxagudwma.ipfs.dweb.link/json/metadata"
          )
          Ownable(initialOwner)
        {}
      
        function setURI(string memory newuri) public onlyOwner {
          _setURI(newuri);
        }
      
        function mint(
          address account,
          uint256 id,
          uint256 amount,
          bytes memory data
        ) public onlyOwner {
          _mint(account, id, amount, data);
        }
      
        function mintBatch(
          address to,
          uint256[] memory ids,
          uint256[] memory amounts,
          bytes memory data
        ) public onlyOwner {
          _mintBatch(to, ids, amounts, data);
        }
      
        // The following functions are overrides required by Solidity.
        function _update(
          address from,
          address to,
          uint256[] memory ids,
          uint256[] memory values
        ) internal override(ERC1155, ERC1155Supply) {
          super._update(from, to, ids, values);
        }
      }
      `,
      name: "SampleNFT",
      arguments: ["0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072"],
      optimization: true,
      runs:200

    })
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
}
verify();
