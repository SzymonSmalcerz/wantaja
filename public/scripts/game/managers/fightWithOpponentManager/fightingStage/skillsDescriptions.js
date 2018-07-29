class Skill {
  constructor(entity,state,name, manaCost, requiredLevel, base) {
    this.name = name;
    this.manaCost = manaCost;
    this.base = base;
    this.entity = entity;
    this.state = state;
    this.groupName = this.name + "_skillDecription";
    this.posX = state.game.width/2;
    this.posY = state.game.height/2;
    this.normalFrame = undefined;
    this.blockedFrame = undefined;
    this.effectText = undefined;
    this.manaCostText = undefined;
    this.blockedText = undefined;
    this.requiredLevel = requiredLevel;
    this.initialize();
  }

  initialize(){
    this.getPositionsCoords();
    let state = this.state;
    state["skill_" + this.name + "_description"] = this;
    state[this.groupName] = state.add.group();

    this.normalFrame = state.game.add.sprite(this.posX,this.posY,"skill_" + this.name + "_description");
    this.normalFrame.anchor.setTo(0.5);
    this.blockedFrame = state.game.add.sprite(this.posX,this.posY,"skill_" + this.name + "_blocked_description");
    this.blockedFrame.anchor.setTo(0.5);

    this.effectText = state.add.text();
    this.manaCostText = state.add.text();
    this.blockedText = state.add.text();
    let textCss = {
      font : "22px bold",
      fontWeight : "900",
      fill : "#FFFFFF"
    }
    let textCssBlocked = {
      font : "18px bold",
      fontWeight : "900",
      fill : '#770000'
    }
    this.effectText.setStyle(textCss);
    this.manaCostText.setStyle(textCss);
    this.blockedText.setStyle(textCssBlocked);
    state[this.groupName].add(this.normalFrame);
    state[this.groupName].add(this.blockedFrame);
    state[this.groupName].add(this.effectText);
    state[this.groupName].add(this.manaCostText);
    state[this.groupName].add(this.blockedText);
    state[this.groupName].fixedToCamera = true;
    state[this.groupName].visible = false;
  }

  updateStatusText() {
    this.effectText.reset(this.positions.effectText.x,this.positions.effectText.y);
    this.effectText.text = this.getEffect();

    this.manaCostText.reset(this.positions.manaCostText.x,this.positions.manaCostText.y);
    this.manaCostText.text = this.getManaCost();
  }

  getPositionsCoords() {
    this.posX = this.state.game.width/2;
    this.posY = this.state.game.height/2;
    this.positions = {
      effectText : {
        x : this.posX - 55,
        y : this.posY - 57
      },
      manaCostText : {
        x : this.posX - 55,
        y : this.posY - 14
      },
      blockedText : {
        x : this.posX - 75,
        y : this.posY + 50
      }
    }
  }

  onResize() {
    this.updateStatusText();
  }

  bringToTop() {
    this.state.game.world.bringToTop(this.state[this.groupName]);
  }

  show() {
    this.bringToTop();
    this.updateStatusText();
    this.chooseFrame();
    this.state[this.groupName].visible = true;
  }

  isSkillDisabled() {
    return this.requiredLevel > this.entity.level || this.manaCost > this.entity.mana;
  }
  // choose if show blocked or normal frame
  chooseFrame() {
    if(this.isSkillDisabled()){
      this.blockedFrame.visible = true;
      this.blockedText.visible = true;
      this.normalFrame.visible = false;
      this.blockedText.reset(this.positions.blockedText.x,this.positions.blockedText.y);
      if(this.requiredLevel > this.entity.level ){
        this.blockedText.text = "required level to use\nthis skill : " + this.requiredLevel;
      } else {
        this.blockedText.text = "not enough mana!";
      }
    } else {
      this.blockedText.visible = false;
      this.blockedFrame.visible = false;
      this.normalFrame.visible = true;
    }
  }

  hide() {
    this.state[this.groupName].visible = false;
  }

  getManaCost(){
    return this.manaCost;
  }

  getEffect() {
    return this.base;
  }
}

class Poison extends Skill{
  constructor(entity,state) {
    super(entity,state,"poison",10,1,0);
  }

  getEffect() {
    return this.entity.attack * 2;
  }
}

class Punch extends Skill{
  constructor(entity,state) {
    super(entity,state,"punch",0,0,0);
  }

  getEffect() {
    return this.entity.attack;
  }
}

class Ignite extends Skill{
  constructor(entity,state) {
    super(entity,state,"ignite",15,2,0);
  }

  getEffect() {
    return this.entity.attack * 4;
  }
}

class Entangle extends Skill{
  constructor(entity,state) {
    super(entity,state,"entangle",20,2,0);
  }

  getEffect() {
    return this.entity.attack * 5;
  }
}

class Health extends Skill{
  constructor(entity,state) {
    super(entity,state,"health",10,2,0);
  }

  getEffect() {
    return this.entity.maxHealth/10;
  }
}


let skillDictionary = {
  "poison" : Poison,
  "punch" : Punch,
  "ignite" : Ignite,
  "entangle" : Entangle,
  "health" : Health,
}
