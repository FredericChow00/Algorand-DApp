async function run(runtimeEnv, deployer) {
    //write your code here
     
    const master = deployer.accountsByName.get("master");

    await deployer.deployASA("TESTASA", {
        creator: master,
        totalFee: 1000,
        validRounds: 1002,
    });    
}

module.exports = { default: run };
