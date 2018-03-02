pragma solidity ^0.4.18;
// We have to specify what version of compiler this code will compile with

contract MillionDollarDapp {
  /* mapping field below is equivalent to an associative array or hash.
  The key of the mapping is candidate name stored as type bytes32 and value is
  an unsigned integer to store the vote count
  */

  address public creator;

  struct Slot {
      uint price;
      address owner;
      string description;
      string image_url;
      string link;
  }

  mapping (uint => Slot) public slots;

  /* This is the constructor which will be called once when you
  deploy the contract to the blockchain. When we deploy the contract,
  we will pass an array of candidates who will be contesting in the election
  */
  function MillionDollarDapp() public {
    creator = msg.sender;
  }

  // This function returns the total votes a candidate has received so far
  function buySlot(uint slotID, string description) payable public {
    require(slotID >= 0 && slotID < 1000000);
    require(msg.value > slots[slotID].price);
    uint oldPrice = slots[slotID].price;
    slots[slotID].price = msg.value * 110 / 100;
    slots[slotID].description = description;
    slots[slotID].owner.transfer(oldPrice);
    slots[slotID].owner = msg.sender;
  }

  function getSlot(uint slotID) view public returns (uint, address, string, string, string) {
      require(slotID >= 0 && slotID < 1000000);
      return (slots[slotID].price, slots[slotID].owner, slots[slotID].description, slots[slotID].image_url, slots[slotID].link);
  }

  function getFunds() public {
      require(msg.sender == creator);
      creator.transfer(this.balance);
  }

}