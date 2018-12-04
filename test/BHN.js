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

    it ("Test #8: msg.owner and tx.origin", async () => {
        let contract = await BHN.deployed();
        let msgowner = await contract.test_msgsender_address.call();
        console.log("msg.owner address", msgowner); // address[0]
        // Ganache, accounts[0]: "0xFba047b6A2E0072F11441E69ec3c09A774a13cA4",
        // but getter returns lowercase address.
        assert.equal(msgowner, "0xfba047b6a2e0072f11441e69ec3c09a774a13ca4",
                "The msg.owner address should be equal to the first Ganashe " +
                                                                    "address!");

        let txorigin = await contract.test_txorigin_address.call();
        console.log("tx.origin address", txorigin) ; //address[0]
        assert.equal(txorigin, "0xfba047b6a2e0072f11441e69ec3c09a774a13ca4",
                "The txorigin address should be equal to the first Ganashe " +
                                                                    "address!");
    });

    it ("Test #9: transfer tokens on behalf of admin", async () => {
        let contract = await BHN.deployed();
        let admin = accounts [0];
        let user1 = accounts [1];
        let user2 = accounts [2];

        let adminBalance = await contract.balanceOf(admin);
        let adminAllowance = await contract.allowance(admin, admin);
        let user1Allowance = await contract.allowance(admin, user1);
        console.log("Admin token balance: ", adminBalance.toNumber());
        console.log("Admin allowance: ", adminAllowance.toNumber()); // 0 [confirms that it does not make sense for admin]
        console.log("User1 allowance: ", user1Allowance.toNumber()); // 0

        // Allow the user1 spend up to 1964 tokens.
        let result = await contract.approve(user1, 1964);
        // Verify that the user1 is allowed to spend up to 1964 tokens.
        user1Allowance = await contract.allowance(admin, user1);
        console.log("Admin allowance: ", adminAllowance.toNumber()); // 0 [confirms that it does not make sense for admin]
        console.log("User1 allowance: ", user1Allowance.toNumber()); // 0

        // Now the user1 on behalf of admin sends 100 tokens to the user2.
        result = await contract.transferFrom(user1, user2, 100);
        user1Allowance = await contract.allowance(admin, user1);
        let user2Balance = await contract.balanceOf(user2);
        console.log("User1 allowance: ", user1Allowance.toNumber());
        console.log("User2 token balance: ", user2Balance.toNumber());
    });

    it ("Test #10: buy tokens with payable function", async () => {
        let contract = await BHN.deployed();

        let buyer = accounts [7];
        // Ganache, accounts[7]: "0x2e9E306A71737008C6710B55A7845fCa53e1541d",
        // but getter returns lowercase address.
        assert.equal(buyer, "0x2e9e306a71737008c6710b55a7845fca53e1541d",
           "For clarity, the Ganashe index 7 account is used here" +
                                                     " to test buying tokens!");
        // Step 1: Check buyer balance.
        let balanceBefore = web3.eth.getBalance(buyer);
        console.log("Buyer :", buyer);
        console.log("Balance before: ", balanceBefore.toNumber() /
                            1000000000000000000 + " ETH"); // 1ETH = 10^18 Wei);
        /*
        assert.equal(balanceBefore.toNumber() / 1000000000000000000, 100,
              "For clarity, the balance of the buyer should be equal 100 ETH." +
                                     "Restart Ganashe if the balance differs!");
        */

        // Step 2: Buy tokens for 1.5 ETH (or send 1.5 ETH to the contract
        // address.
        //let amount = web3.toWei(1.5, 'ether');
        let amount = web3.toWei(3, 'ether');
        let hash = await contract.buy.sendTransaction({from: buyer,
                                                                value: amount});
        // Step 3: Examine transaction hash.
        let tx = await web3.eth.getTransaction(hash);
        console.log("Transaction hash: ",  tx.hash);
        console.log("Transaction WEI amount: ", tx.value.toNumber());
        /*
        assert.equal(tx.value.toNumber(), 1500000000000000000,
              "The WEI amount should be 1500000000000000000 WEI (or 1.5 ETH)!");
        */
        console.log("To (contact address): ", tx.to);
        //console.log("Buyer=msg.sender in this case :", tx.sender); // undefined
        console.log("From buyer :", tx.from);
        assert.equal(tx.from,  "0x2e9e306a71737008c6710b55a7845fca53e1541d",
                   "The Ganashe index 7 account should be used here as buyer!");
        // Step 4: Verify token price (BHN/ETH).
        let tokenprice = await contract.tokensforoneether.call();
        console.log("Token price: ", tokenprice.toNumber());
        assert.equal(tokenprice.toNumber(), 10, "The number of tokens for 1 " +
                                                        "ETH differs from 10!");
        // Step 5: Calculate the number of tokens.
        console.log("Tokens asked: ", (tx.value.toNumber() /
                                  1000000000000000000) * tokenprice.toNumber());
        // Step 6: Verify balances after transaction.
        let adminBalance = await contract.balanceOf(accounts[0]);
        console.log("Admin balance: ", adminBalance.toNumber());
        let buyerBalance = await contract.balanceOf(accounts[7]);
        console.log("Buyer balance: ", buyerBalance.toNumber());

        let tokensSoldCount = await contract.tokensSoldCount.call();
        let tokensAvailableCount = await contract.tokensAvailableCount.call();
        console.log("ICO tokens sold: ", tokensSoldCount.toNumber());
        console.log("ICO tokens available: ", tokensAvailableCount.toNumber());
    });
});
