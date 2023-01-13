/* eslint-disable */
import algosdk from "algosdk";

const sendAlgoSignerTransaction = async (txns, algodClient) => {
    const AlgoSigner = window.AlgoSigner;

    if (typeof AlgoSigner !== "undefined") {
        // write your code here
        try {

            // Group all transactions
            algosdk.assignGroupID(txns);

            // Get the binary and base64 encode it
            let binaryTxns = txns.map(txn => txn.toByte());
            let base64Txns = binaryTxns.map(binary => AlgoSigner.encoding.msgpackToBase64(binary));

            let signedTxns = await AlgoSigner.signTxn([
                {
                    txn: base64Txns[0],
                },
                {
                    txn: base64Txns[1],
                },
                {
                    txn: base64Txns[2],
                },
            ]);

            // Get the base64 encoded signed transaction and convert it to binary
            let binarySignedTxns = signedTxns.map(stxn => AlgoSigner.encoding.base64ToMsgpack(stxn.blob));

            const response = await algodClient
                .sendRawTransaction(binarySignedTxns)
                .do();
            console.log(response);

            await algosdk.waitForConfirmation(
                algodClient,
                response.txId,
                4
            );

            return response;
        } catch (err) {
            console.error(err);
            alert("Error!");
        }
    }
};

export default {
    sendAlgoSignerTransaction
};
