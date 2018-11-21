var BHN = artifacts.require("BHN");

//contract('BHN', function(accounts) {
contract('BHN', (accounts) => {
    // let inst;
    // beforeEach (async () => {
    //     contract = await BHN.new()
    //  })

    it ("Test #0: configuration test", function() {
        assert.equal(8, 8);
    });

    it ("Test #1: transaction test", async () => {
    // it ("Test #2", async function () {
         let contract = await BHN.new ({from: accounts[1]});
         //let contract = await BHN.deployed();
         //let contract = await BHN.new ();
         let amount = web3.toWei(1, 'ether');
         //let amount = 0;
         let buyer = accounts [2];
        //
        let balanceBefore = web3.eth.getBalance(buyer);
        let hash = await contract.buy.sendTransaction({from: buyer, value: amount});
        let balanceAfter = web3.eth.getBalance(buyer);
        //
        let tx = await web3.eth.getTransaction(hash);
        //console.log(msg.value); // error
        console.log("Buyer :", buyer);
        console.log("Amount sent (WEI): ", amount);
        console.log("Balance before: ", balanceBefore.toNumber());
        console.log("Balance after: ", balanceAfter.toNumber());
        console.log("Nonce: " + tx.nonce);
        console.log("Gas used: ", tx.gasUsed);
        console.log("Gas: ", tx.gas);
        console.log("Gas price: " + tx.gasPrice.toNumber());
        console.log("Gas limit: " + tx.gasLimit);
        console.log("To: " + tx.to);
        console.log("Data: " + tx.data);
        console.log("Origin: " + tx.origin);
        //console.log("Transaction hash: ",  tx.transactionHash); // undefined
        console.log("Transaction hash: ",  tx.hash); // OK
        console.log("Block number: ",  tx.blockNumber);
        console.log("Transaction: ",  tx); // all in increamentCounter

        let count = await contract.count.call();
        console.log("Counter: ", count.toNumber());

        let sender = await contract.sender.call();
        console.log("Sender: ", sender);
    });
});
