/* eslint-disable */
import algosdk from "algosdk";
import { getAlgodClient } from "./client.js";
import wallets from "./wallets.js";
import { convertByte32ToIpfsCidV0 } from "../scripts/helpers/ipfs2bytes32.js";

const purchaseNFT = async (creator, receiver, nftId, fungibleTokenId, network) => {
    const algodClient = getAlgodClient(network);
    
    // create transactions here before calling sendAlgoSignerTransaction from wallet.js
    
    // write your code here
    const suggestedParams = await algodClient.getTransactionParams().do();

    // receiver opts in to NFT
    let nftOptIn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        receiver,
        receiver,
        undefined,
        undefined,
        0,
        undefined,
        nftId,
        suggestedParams
    );

    // transfer NFT to receiver
    let nftTransfer = algosdk.makeAssetTransferTxnWithSuggestedParams(
        creator,
        receiver,
        undefined,
        undefined,
        1,
        undefined,
        nftId,
        suggestedParams
    );

    // transfer tokens to creator
    let tokenTransfer = algosdk.makeAssetTransferTxnWithSuggestedParams(
        receiver,
        creator,
        undefined,
        undefined,
        5,
        undefined,
        fungibleTokenId,
        suggestedParams
    );

    // Store all transactions
    let txns = [nftOptIn, nftTransfer, tokenTransfer];

    return await wallets.sendAlgoSignerTransaction(txns, algodClient);
}

const getAccountInfo = async (address, network) => {
    const algodClient = getAlgodClient(network);

    return await algodClient.accountInformation(address).do();
};

const checkMetadataHash = (uint8ArrHash, assetURL) => {
    // convert uint8array to hex string
    let metadataHash = Buffer.from(uint8ArrHash).toString("hex");

    // get IPFS cid of json metadata 
    const cid = convertByte32ToIpfsCidV0(metadataHash);

    // check if cid from assetURL is the same as cid extracted from metadata hash
    let cid_from_assetURL = assetURL.replace("ipfs://", "");
    cid_from_assetURL = cid_from_assetURL.replace("#arc3", "");

    return cid_from_assetURL === cid;
}

export default {
    purchaseNFT,
    checkMetadataHash,
    getAccountInfo,
};