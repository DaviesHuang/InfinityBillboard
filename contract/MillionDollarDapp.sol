pragma solidity ^0.4.18;

contract InfinityBillboard {

  address public creator;

  struct Slot {
      uint price;
      address owner;
      string description;
      string image_url;
      string link;
  }

  mapping (uint => Slot) public slots;

  function InfinityBillboard() public {
    creator = msg.sender;
  }

  function buySlot(uint slotID, string description, string image_url, string link) payable public {
    require(slotID >= 0 && slotID < 100);
    require(msg.value > slots[slotID].price);

    uint oldPrice = slots[slotID].price;
    slots[slotID].price = msg.value * 110 / 100;
    slots[slotID].description = description;
    slots[slotID].image_url = image_url;
    slots[slotID].link = link;
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