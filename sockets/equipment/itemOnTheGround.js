let cache = {};
class Item {
  constructor(x,y,map,key,type) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.key = key;
    this.type = type;
    this.id = Math.floor(Math.random() * 10000) + this.key + Math.floor(Math.random() * 10000);
    cache[this.id] = this;
    setTimeout(() => {
      if(cache[this.id]) {
        console.log("ITEM STILL EXISTS");
        cache[this.id].wanish();
      }
    }, 30000)
  };

  wanish() {
    this.map.removeItem(this.id);
  }
};

module.exports = Item;
