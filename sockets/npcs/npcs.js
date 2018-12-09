class Npc {
  constructor(x, y, npcKey, animated) {
    this.x = x;
    this.y = y;
    this.key = npcKey;
    this.id = npcKey;
    this.animated = animated || false;
  }
}

module.exports = Npc;
