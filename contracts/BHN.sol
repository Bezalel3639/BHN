pragma solidity ^0.4.24;

// ERC20 standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
contract ERC20Interface {
    function totalSupply() public view returns (uint256);
    function balanceOf(address _owner) public view returns (uint256);
    function transfer(address _to, uint256 _value)
                                                  public returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value)
                                                  public returns (bool success);
    function approve(address _spender, uint256 _value)
                                                  public returns (bool success);
    function allowance(address _owner, address _spender)
                                        public view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender,
                                                                uint256 _value);
}

contract TokenSettings {
    string public name = "BHN Token";
    string public symbol = "BHN";
    uint256 public decimals = 18;
    uint256 public hardcap = 144000000; // 144M
    uint256 public tokensforoneether = 10;

    // Dynamic.
    uint256 public tokensSoldCount = 0;
    uint256 public tokensAvailableCount = 0; // init in constructor
}

contract ERC20Token is ERC20Interface, TokenSettings {
    string public teststring = "ERC20Token string";
    address public test_msgsender_address;
    address public test_txorigin_address;

    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender,
                                                                uint256 _value);

    constructor() public {
        //TokenSettings ts = new TokenSettings(); // first run
        //balances[tx.origin] = ts.hardcap();
        balances[tx.origin] = hardcap;
        tokensAvailableCount = hardcap;
        test_msgsender_address = msg.sender;
        test_txorigin_address = tx.origin;
    }

    function totalSupply() public view returns (uint256) {
        return balances[tx.origin];
    }

    function balanceOf (address _address) public view
                                                     returns (uint256 balance) {
        return balances[_address];
    }

    function transfer(address _to, uint256 _value) public
                                                         returns(bool success) {
        require(balanceOf(msg.sender) >= _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public
                                                        returns (bool success) {
        require(_value > 0 && balanceOf(_from) >= _value);
        require(allowances[msg.sender][_from] >= _value);

        //balances[msg.sender] -= _valuebalances[msg.sender] -= _value;
        balances[_from] -= _value;
        balances[_to] += _value;
        //allowances[_from][msg.sender] -= _value;
        allowances[msg.sender][_from] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

    function approve (address _spender, uint256 _value) public
                                                        returns (bool success) {
        allowances[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function allowance (address _owner, address _spender) public view
                                                   returns (uint256 remaining) {
        return allowances[_owner][_spender];
    }
}

contract BHN is ERC20Token {
    int public count = 0;
    address public sender = msg.sender;
    address admin;

    //string public teststr = teststring;
    //ERC20Token public token = new ERC20Token();

    constructor() public {
        admin = msg.sender;
    }

    function buy () public payable {
        increamentCounter();
        require (msg.value > 0);

        uint256 weireceived = msg.value;
        //  1000000000000000000 WEI (18 zeros) is 1 ETH.
        uint256 tokens2sell = (weireceived / 1000000000000000000) *
                                                              tokensforoneether;
        balances[msg.sender] += tokens2sell;
        emit Transfer(address(this), msg.sender, tokens2sell);

        tokensSoldCount += tokens2sell;
        tokensAvailableCount -= tokens2sell;

        admin.transfer(weireceived);
    }

    function increamentCounter () public {
        count += 1;
    }

    function getCount () public view returns (int) {
        return count;
    }
}
