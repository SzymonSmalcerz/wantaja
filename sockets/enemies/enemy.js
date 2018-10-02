class ItemToDrop {
  constructor(itemKey, itemType, chanceToDrop) {
    this.itemKey = itemKey;
    this.itemType = itemType;
    this.chanceToDrop = chanceToDrop;
  }

  dropped() {
    if(Math.random() * 100 <= this.chanceToDrop) {
      return true;
    } else {
      return false;
    }
  }
}

class DropData {
  constructor(minAmountMoney, maxAmountMoney, itemsToDrop) {
    this.minAmountMoney = minAmountMoney;
    this.maxAmountMoney = maxAmountMoney;
    this.itemsToDrop = itemsToDrop;
  }

  drop() {
    let droppedItem = null;
    this.itemsToDrop.sort(() => Math.random() - 0.5);
    this.itemsToDrop.forEach(item => {
      if(!droppedItem && item.dropped()) {
        droppedItem = {
          key : item.itemKey,
          type : item.itemType
        };
      }
    })
    console.log(":)");
    return {
      droppedMoney : Math.floor(Math.random() * (this.maxAmountMoney - this.minAmountMoney)) + this.minAmountMoney,
      droppedItem
    }
  }
}



class Enemy {
  constructor(x,y,map,id,lvl,key,hp,damage,exp,skillName,dropData,animated,mana) {
    this.map = map;
    this.dropData = dropData;
    this.x = x;
    this.y = y;
    this.id = id;
    this.lvl = lvl || 0;
    this.key = key;
    this.health = hp || 100;
    this.mana = mana || 100;
    this.maxHealth = hp || 100;
    this.attack = damage || 10;
    this.exp = exp || 100;
    this.isFighting = false;
    this.skillName = skillName || "punch";
    this.animated = animated || false;
  };

  drop() {
    return this.dropData.drop();
  }

  onDie(){
    this.map.currentNumberOfMobs -= 1;
    delete this.map.mobsDataToSend[this.id];
    delete this.map.mobs[this.id];
  }
};

let spiderDropData = new DropData(10,100,[
  new ItemToDrop("boots_1","boots",10),
  new ItemToDrop("boots_2","boots",10),
  new ItemToDrop("armor_1","armor",10),
  new ItemToDrop("armor_2","armor",10),
  new ItemToDrop("weapon_1","weapon",10),
  new ItemToDrop("weapon_2","weapon",10),
  new ItemToDrop("gloves_1","gloves",10),
  new ItemToDrop("gloves_2","gloves",10),
  new ItemToDrop("helmet_1","helmet",10),
  new ItemToDrop("helmet_2","helmet",10),
  new ItemToDrop("shield_1","shield",10),
  new ItemToDrop("shield_2","shield",10),
  new ItemToDrop("special_1","special",10),
  new ItemToDrop("special_2","special",10)
]);
class Spider extends Enemy {
  constructor(x,y,map) {
    let id = Math.floor(Math.random() * 100000) + "spider";
    super(x,y,map,id,2,"spider",100,null,null,"poison",spiderDropData);
  }
};

let beeDropData = new DropData(0,50,[
  new ItemToDrop("boots_1","boots",10),
  new ItemToDrop("armor_1","armor",10),
  new ItemToDrop("weapon_1","weapon",10),
  new ItemToDrop("gloves_1","gloves",10),
  new ItemToDrop("helmet_1","helmet",10),
  new ItemToDrop("shield_1","shield",10),
  new ItemToDrop("special_1","special",10)
]);
class Bee extends Enemy {
  constructor(x,y,map) {
    let id = Math.floor(Math.random() * 100000) + "bee";
    super(x,y,map,id,1,"bee",100,null,null,"poison",beeDropData,true);
  }
};

module.exports = {
  Spider,
  Bee
}
