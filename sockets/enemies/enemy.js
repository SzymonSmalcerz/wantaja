class Enemy {
  constructor(x,y,map,id,lvl,key,hp,damage,exp,skillName,animated,mana) {
    this.map = map;
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

  onDie(){
    this.map.currentNumberOfMobs -= 1;
    delete this.map.mobsDataToSend[this.id];
    delete this.map.mobs[this.id];
  }
};

class Spider extends Enemy {
  constructor(x,y,map) {
    let id = Math.floor(Math.random() * 100000) + "spider";
    super(x,y,map,id,2,"spider",100,null,null,"poison");
  }
};

class Bee extends Enemy {
  constructor(x,y,map) {
    let id = Math.floor(Math.random() * 100000) + "bee";
    super(x,y,map,id,1,"bee",100,null,null,"poison",true);
  }
};

module.exports = {
  Spider,
  Bee
}
