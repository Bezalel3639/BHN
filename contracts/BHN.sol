pragma solidity ^0.4.24;
//pragma solidity ^0.4.22;

contract BHN {
  //int private count = 0;
  int public count = 0;

  //address public owner = msg.owner;
  address public sender = msg.sender;

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
