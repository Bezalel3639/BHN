var BHN = artifacts.require("BHN");
//var BHN = artifacts.require("./BHN.sol");

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
        //let contract = await BHN.new ({from: accounts[1]});
        let contract = await BHN.deployed(); // OK
        //let contract = await BHN.new ();
        let amount = web3.toWei(1, 'ether');
        //let amount = 0;
        let buyer = accounts [2];
        //
        let balanceBefore = web3.eth.getBalance(buyer);
        let hash = await contract.buy.sendTransaction({from: buyer,
                                                                value: amount});
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
        console.log("Contract address: ", contract.address);
    });

    it ("Test #3: base class variable should be readable (visibility test)",
                                                                   async () => {
        let contract = await BHN.deployed();
        let teststring = await contract.teststring.call();
        console.log("Test: ", teststring);
    });

    it ("Test #5: total supply should be 144M tokens", async () => {
        let contract = await BHN.deployed();
        let totalSupply = await contract.totalSupply.call();
        console.log("Total supply: ", totalSupply.toNumber());
        assert.equal(totalSupply.toNumber(), 144000000,
                                            "Total supply doesn't match 144M!");
    });

    it ("Test #6: check user balances", async () => {
        let contract = await BHN.deployed();
        let admin = accounts [0];
        //let userBalance = await contract.balanceOf(user).call();
        let userBalance = await contract.balanceOf(admin);
        let balanceETH = web3.eth.getBalance(admin);
        console.log("Admin address: ", admin);
        console.log("Admin token balance: ", userBalance.toNumber());
        console.log("Admin WEI balance: ", balanceETH.toNumber());
        console.log("Admin ETH balance: ", balanceETH.toNumber() /
                                       1000000000000000000); // 1ETH = 10^18 Wei
        assert.equal(userBalance.toNumber(), 144000000,
                "Initial admin token balance should equal total supply, 144M!");

        let user1 = accounts [1];
        userBalance = await contract.balanceOf(user1);
        console.log("User1 address: ", user1);
        console.log("User1 token balance: ", userBalance.toNumber());

        let user2 = accounts [2];
        userBalance = await contract.balanceOf(user2);
        console.log("User2 address: ", user2);
        console.log("User2 token balance: ", userBalance.toNumber());
    });

    it ("Test #7: transfer tokens", async () => {
        let contract = await BHN.deployed();
        let admin = accounts [0];
        let user1 = accounts [1];

        // Balances before transfer.
        let adminBalance = await contract.balanceOf(admin);
        let userBalance = await contract.balanceOf(user1);
        console.log("---------Balances before transfer---------");
        console.log("Admin address: ", admin);
        console.log("Admin token balance: ", adminBalance.toNumber());
        console.log("User address: ", user1);
        console.log("User token balance: ", userBalance.toNumber());

        // Transfer 1999 tokens from admin to user1.
        let result = await contract.transfer(user1, 1999);

        // Balances after transfer.
        adminBalance = await contract.balanceOf(admin);
        userBalance = await contract.balanceOf(user1);
        console.log("---------Balances after transfer---------");
        console.log("Admin address: ", admin);
        console.log("Admin token balance: ", adminBalance.toNumber());
        console.log("User address: ", user1);
        console.log("User token balance: ", userBalance.toNumber());
    });
});
