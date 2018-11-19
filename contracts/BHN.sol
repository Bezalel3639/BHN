pragma solidity ^0.4.18;

contract BHN {
  int private count = 0;

  function increamentCounter () public {
      count += 1;
  }

  function decreamentCounter () public {
      count -= 1;
  }

  function getCount () public view returns {
      return count;
  }
}
