class Enemy {
  constructor(x,y,map,id,key,hp,damage,exp,skillName) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.id = id;
    this.key = key;
    this.health = hp || 100;
    this.maxHealth = hp || 100;
    this.damage = damage || 10;
    this.exp = exp || 100;
    this.isFighting = false;
    this.skillName = skillName || "punch";
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
    super(x,y,map,id,"spider",null,null,null,"poison");
  }
};

module.exports = {
  Spider
}
