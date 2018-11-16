const equipment = require("../equipment/equipment");

class Item {
  constructor(positionX, positionY, itemKey, type, price) {
    for (var key in equipment[type][itemKey]) {
      if (equipment[type][itemKey].hasOwnProperty(key)) {
        this[key] = equipment[type][itemKey][key];
      }
    }
    this.positionX = positionX;
    this.positionY = positionY;
    this.key = itemKey;
    this.type = type;
    this.price = price;
  }
}

class Trader {
  constructor(x, y, key, items) {
    this.x = x;
    this.y = y;
    this.key = key;
    this.id = key;
    this.items = items;
  }
}

class Trader_Greengrove extends Trader {
  constructor(x, y, key) {
    let items = [
      new Item(0, 0, 'weapon_1', 'weapon', 100),
      new Item(1, 0, 'boots_1', 'boots', 100),
      new Item(2, 0, 'gloves_1', 'gloves', 100),
      new Item(3, 0, 'helmet_1', 'helmet', 100),
      new Item(0, 1, 'shield_1', 'shield', 100),
      new Item(1, 1, 'special_1', 'special', 100)
    ]

    super(x, y, 'Trader', items);
  }
}

module.exports = {
  Trader_Greengrove
}
