class Skill {
  constructor(skillName,manaCost,baseDamage) {
    this.skillName = skillName;
    this.manaCost = manaCost;
    this.baseDamage = baseDamage;
  };

  getDamage(boost){
    return this.baseDamage;
  }
};


class Punch extends Skill {
  constructor() {
    super("punch",1,5);
  };

  getDamage(attack){
    return attack * 2;
  };
};

class Poison extends Skill {
  constructor() {
    super("poison",10,10);
  };

  getDamage(magicAttack){
    return magicAttack * 3;
  };
};

module.exports = {
  Punch,
  Poison
};
