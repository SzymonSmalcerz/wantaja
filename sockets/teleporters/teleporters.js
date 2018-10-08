class Teleporter {
  constructor(x, y, teleports, key = 'teleporter') {
    this.x = x;
    this.y = y;
    this.teleports = teleports;
    this.key = key;
    this.id = key;
  }
}

module.exports = Teleporter;
