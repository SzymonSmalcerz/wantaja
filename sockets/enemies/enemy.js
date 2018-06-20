class Enemy {
  constructor(x,y,map,id,key,hp,damage,exp) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.id = id;
    this.key = key;
    this.health = hp || 100;
    this.maxHealth = hp;
    this.damage = damage || 10;
    this.exp = exp || 100;
  }

  onDie(){
    this.map.currentNumberOfMobs -= 1;
    delete this.map.mobsDataToSend[this.id];
  }
};

class Spider extends Enemy {
  constructor(x,y,map) {
    let id = Math.floor(Math.random() * 100000) + "spider";
    super(x,y,map,id,"spider");
  }
};

module.exports = {
  Spider
}
