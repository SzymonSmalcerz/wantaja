class Skill {
  constructor(skillName,manaCost,baseDamage) {
    this.skillName = skillName;
    this.manaCost = manaCost;
    this.baseDamage = baseDamage;
  };

  getDamage(player,enemy) {
    enemy.health -= this.baseDamage;
  }
};


class Punch extends Skill {
  constructor() {
    super("punch",1,5);
  };

  getDamage(player,enemy){
    enemy.health -= player.attack;
  };
};

class Poison extends Skill {
  constructor() {
    super("poison",10,10);
  };

  getDamage(player,enemy) {
    enemy.health -= player.attack * 2;
    player.mana -= this.manaCost;
  };
};

class Ignite extends Skill {
  constructor() {
    super("ignite",15,15);
  };

  getDamage(player,enemy) {
    enemy.health -= player.attack * 4;
    player.mana -= this.manaCost;
  };
};

class Entangle extends Skill {
  constructor() {
    super("entangle",20,20);
  };

  getDamage(player,enemy) {
    enemy.health -= player.attack * 5;
    player.mana -= this.manaCost;
  };
};

class Health extends Skill {
  constructor() {
    super("health",10,10);
  };

  getDamage(player,enemy) {
    player.health += player.maxHealth/10;
    player.health = Math.min(player.health,player.maxHealth);
    player.mana -= this.manaCost;
    if(player.socket) {
      player.socket.emit("playerUpdate",{
        health : player.health
      })
    }
  };
};

module.exports = {
  Punch,
  Poison,
  Ignite,
  Entangle,
  Health
};
