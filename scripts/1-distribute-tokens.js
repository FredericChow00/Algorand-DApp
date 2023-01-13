const { executeTransaction } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");
const { default: algosdk } = require("algosdk");

async function run(runtimeEnv, deployer) {
    //write your code here
    const master = deployer.accountsByName.get("master");
    const assetId = deployer.asa.get("TESTASA").assetIndex;

    // create buyer and fund it with some algos first
    const buyer = deployer.accounts[1];
    await executeTransaction(deployer, {
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        toAccountAddr: buyer.addr,
        amountMicroAlgos: 300000,
        payFlags: { totalFee: 1000 },
    });

    // fungible token opt in
    await executeTransaction(deployer, {
        type: types.TransactionType.OptInASA,
        sign: types.SignType.SecretKey,
        fromAccount: buyer,
        assetID: assetId,
        payFlags: { totalFee: 1000 },
    });

    // fund buyer with 100 fungible token
    await executeTransaction(deployer, {
        type: types.TransactionType.TransferAsset,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        toAccountAddr: buyer.addr,
        amount: 100,
        assetID: assetId,
        payFlags: { totalFee: 1000 },
    });

    const buyerAcc = await deployer.algodClient.accountInformation(buyer.addr).do();
    console.log(buyerAcc.assets);
}

module.exports = { default: run };
