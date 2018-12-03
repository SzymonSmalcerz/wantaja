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
    enemy.health -= this.baseDamage * (1 - ( enemy.defence ? enemy.defence : 0 )/( enemy.level * 5 ));
    return {
      takenHealth : this.baseDamage
    }
  }

  isSkillDodged(player,enemy) {
    if(enemy.dodge){
      if(Math.random() * 100 <= (enemy.dodge - ( Math.max((enemy.level - player.level) * 2, 0) )) * 10/enemy.level){
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
    let takenHealth = player.attack * (1 - ( enemy.defence ? enemy.defence : 0 )/( enemy.level * 5 ));
    enemy.health -= takenHealth;
    return {
      takenHealth
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
    let takenHealth = player.attack * 2 * (1 - ( enemy.defence ? enemy.defence : 0 )/( enemy.level * 5 ));
    enemy.health -= takenHealth;
    player.mana -= this.manaCost;
    return {
      takenHealth
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
    let takenHealth = player.attack * 3 * (1 - ( enemy.defence ? enemy.defence : 0 )/( enemy.level * 5 ));
    enemy.health -= takenHealth;
    player.mana -= this.manaCost;
    return {
      takenHealth
    }
  };
};

class Entangle extends Skill {
  constructor() {
    super("entangle",20,2,20);
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
    let takenHealth = player.attack * 4 * (1 - ( enemy.defence ? enemy.defence : 0 )/( enemy.level * 5 ));
    enemy.health -= takenHealth;
    player.mana -= this.manaCost;
    return {
      takenHealth
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
