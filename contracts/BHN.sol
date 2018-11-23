pragma solidity ^0.4.24;

contract ERC20Token {
    string public teststring = "ERC20Token string";

    mapping (address => mapping (address => uint256)) public allowances;
    mapping (address => uint256) public balances;

    //event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        balances[tx.origin] = 144000000; // 144M
    }

    function totalSupply() public view returns (uint256) {
        return balances[tx.origin];
    }

    function balanceOf (address _address) constant public returns (uint256 balance){
        return balances[_address];
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        require(balanceOf(msg.sender) >= _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        return true;
    }

    function approve (address _spender, uint256 _value) public returns (bool success) {
        allowances[msg.sender][_spender] = _value;

        return true;
    }

    function allowance (address _owner, address _spender) public view returns (uint256 remaining) {
        return allowances[_owner][_spender];
    }
}

contract BHN is ERC20Token {
  int public count = 0;
  address public sender = msg.sender;

  //string public teststr = teststring;
  //ERC20Token public token = new ERC20Token();

  function increamentCounter () public {
      count += 1;
  }

  function decreamentCounter () public {
      count -= 1;
  }

  function getCount () public view returns (int) {
      return count;
  }

  function buy () public payable {
  }
}
