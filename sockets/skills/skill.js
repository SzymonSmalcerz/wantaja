class Skill {
  constructor(skillName,manaCost,requiredLevel,baseDamage) {
    this.skillName = skillName;
    this.manaCost = manaCost;
    this.requiredLevel = requiredLevel;
    this.baseDamage = baseDamage;
  };

  getDamage(player,enemy) {
    if(this.isSkillDodged(player,enemy)){
      return {
        dodge : true
      }
    };
    enemy.health -= this.baseDamage;
    return {
      takenHealth : this.baseDamage
    }
  }

  isSkillDodged(player,enemy) {
    if(enemy.dodge){
      if(Math.random() * 100 <= enemy.dodge){
        return true;
      }
    }
    return false;
  }
};


class Punch extends Skill {
  constructor() {
    super("punch",0,0,5);
  };

  getDamage(player,enemy){
    if(this.isSkillDodged(player,enemy)){
      return {
        dodge : true
      }
    };
    enemy.health -= player.attack;
    return {
      takenHealth : player.attack
    }
  };
};

class Poison extends Skill {
  constructor() {
    super("poison",10,1,10);
  };

  getDamage(player,enemy) {
    if(this.isSkillDodged(player,enemy)){
      return {
        dodge : true
      }
    };
    if(player.level){
      if(player.level < this.requiredLevel){
        return;
      }
    }
    enemy.health -= player.attack * 2;
    player.mana -= this.manaCost;
    return {
      takenHealth : player.attack * 2
    }
  };
};

class Ignite extends Skill {
  constructor() {
    super("ignite",15,2,15);
  };

  getDamage(player,enemy) {
    if(this.isSkillDodged(player,enemy)){
      return {
        dodge : true
      }
    };
    if(player.level){
      if(player.level < this.requiredLevel){
        return;
      }
    }
    enemy.health -= player.attack * 4;
    player.mana -= this.manaCost;
    return {
      takenHealth : player.attack * 4
    }
  };
};

class Entangle extends Skill {
  constructor() {
    super("entangle",20,2,20);
  };

  getDamage(player,enemy) {
    return {
      dodge : true
    }
    if(player.level){
      if(player.level < this.requiredLevel){
        return;
      }
    }
    enemy.health -= player.attack * 5;
    player.mana -= this.manaCost;
    return {
      takenHealth : player.attack * 5
    }
  };
};

class Health extends Skill {
  constructor() {
    super("health",10,2,10);
  };

  getDamage(player,enemy) {
    if(player.level){
      if(player.level < this.requiredLevel){
        return;
      }
    }
    let playerOldHealth = player.health;
    player.health += player.maxHealth/10;
    player.health = Math.min(player.health,player.maxHealth);
    player.mana -= this.manaCost;
    if(player.socket) {
      player.socket.emit("playerUpdate",{
        health : player.health
      })
    }
    return {
      addedHealth : player.health - playerOldHealth
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
