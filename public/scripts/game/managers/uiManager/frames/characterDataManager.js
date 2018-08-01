class CharacterDataManager extends UIFrameManager{
  constructor(state,uiManager) {
    super(state,uiManager,Phaser.Keyboard.X);
  }

  initialize() {
    this.getPositionsCoords();
    let state = this.state;
    state.characterData = state.add.group();
    this.frameGroup = state.characterData;
    state.characterDataBackground = state.game.add.sprite(this.posX,this.posY,"characterDataFrame");
    state.characterDataBackground.anchor.setTo(0.5);
    this.uiManager.blockPlayerMovementsWhenOver(state.characterDataBackground);

    this.attackText = state.add.text();
    this.attackQuestionMark = state.game.add.sprite(0,0, "questionMark");
    this.attackDescription = state.game.add.sprite(0,0, "characterData_attack_description");
    this.attackDescription.visible = false;
    this.addListenersToQuestionMatk(this.attackQuestionMark, this.attackDescription);

    this.healthText = state.add.text();
    this.healthQuestionMark = state.game.add.sprite(0,0, "questionMark");
    this.healthDescription = state.game.add.sprite(0,0, "characterData_health_description");
    this.healthDescription.visible = false;
    this.addListenersToQuestionMatk(this.healthQuestionMark, this.healthDescription);

    this.manaText = state.add.text();
    this.manaQuestionMark = state.game.add.sprite(0,0, "questionMark");
    this.manaDescription = state.game.add.sprite(0,0, "characterData_mana_description");
    this.manaDescription.visible = false;
    this.addListenersToQuestionMatk(this.manaQuestionMark, this.manaDescription);

    this.dodgeText = state.add.text();
    this.dodgeQuestionMark = state.game.add.sprite(0,0, "questionMark");
    this.dodgeDescription = state.game.add.sprite(0,0, "characterData_dodge_description");
    this.dodgeDescription.visible = false;
    this.addListenersToQuestionMatk(this.dodgeQuestionMark, this.dodgeDescription);

    this.levelText = state.add.text();
    this.levelQuestionMark = state.game.add.sprite(0,0, "questionMark");
    this.levelDescription = state.game.add.sprite(0,0, "characterData_lvl_description");
    this.levelDescription.visible = false;
    this.addListenersToQuestionMatk(this.levelQuestionMark, this.levelDescription);

    let textCss = {
      font : "18px bold",
      fontWeight : "900"
    }

    this.attackText.setStyle(textCss);
    this.healthText.setStyle(textCss);
    this.manaText.setStyle(textCss);
    this.dodgeText.setStyle(textCss);
    this.levelText.setStyle(textCss);

    state.characterData.add(state.characterDataBackground);
    state.characterData.add(this.attackText);
    state.characterData.add(this.attackDescription);
    state.characterData.add(this.attackQuestionMark);
    state.characterData.add(this.healthText);
    state.characterData.add(this.healthDescription);
    state.characterData.add(this.healthQuestionMark);
    state.characterData.add(this.manaText);
    state.characterData.add(this.manaDescription);
    state.characterData.add(this.manaQuestionMark);
    state.characterData.add(this.dodgeText);
    state.characterData.add(this.dodgeDescription);
    state.characterData.add(this.dodgeQuestionMark);
    state.characterData.add(this.levelText);
    state.characterData.add(this.levelDescription);
    state.characterData.add(this.levelQuestionMark);
    state.characterData.fixedToCamera = true;
    this.hideWindow();
  }

  addListenersToQuestionMatk(questionMark, description){
    questionMark.inputEnabled = true;
    questionMark.events.onInputOver.add(function(){
      description.visible = true;
    },this);
    questionMark.events.onInputDown.add(function(){
      description.visible = true;
    },this);
    questionMark.events.onInputOut.add(function(){
      description.visible = false;
    },this);
    questionMark.events.onInputUp.add(function(){
      description.visible = false;
    },this);
  }
  showWindow(){
    this.updateTextsAndQuestionMarks();
    super.showWindow();
  }

  getPositionsCoords() {
    super.getPositionsCoords();
    this.positions = {
      levelText : {
        x : this.posX - 30,
        y : this.posY - 100
      },
      attackText : {
        x : this.posX - 30,
        y : this.posY - 50
      },
      manaText : {
        x : this.posX - 30,
        y : this.posY
      },
      healthText : {
        x : this.posX - 30,
        y : this.posY + 50
      },
      dodgeText : {
        x : this.posX - 30,
        y : this.posY + 100
      },
    }
  }

  updateTextsAndQuestionMarks() {
    this.attackText.reset(this.positions.attackText.x,this.positions.attackText.y);
    this.attackText.text = "attack points: \n" + this.roundTo2Decimals(this.state.player.attack * 0.9) + " - " + this.roundTo2Decimals(this.state.player.attack * 1.1);

    this.manaText.reset(this.positions.manaText.x,this.positions.manaText.y);
    this.manaText.text = "mana points: \n" + this.state.player.maxMana;

    this.healthText.reset(this.positions.healthText.x,this.positions.healthText.y);
    this.healthText.text = "health points: \n" + this.state.player.maxHealth;

    this.dodgeText.reset(this.positions.dodgeText.x,this.positions.dodgeText.y);
    this.dodgeText.text = "chance to dodge: \n" + this.roundTo2Decimals(this.state.player.dodge) + "%";
    this.dodgeQuestionMark.reset(this.positions.dodgeText.x - 40,this.positions.dodgeText.y + 25);
    this.dodgeDescription.reset(this.positions.dodgeText.x,this.positions.dodgeText.y);
    this.dodgeDescription.visible = false;

    this.levelText.reset(this.positions.levelText.x,this.positions.levelText.y);
    this.levelText.text = "lvl: " + this.state.player.level +"\nexp: " + this.state.player.experience + "/" + this.state.player.requiredExperience;
    this.levelQuestionMark.reset(this.positions.levelText.x - 40,this.positions.levelText.y + 25);
    this.levelDescription.reset(this.positions.levelText.x,this.positions.levelText.y);
    this.levelDescription.visible = false;
    this.levelDescription.smoothed = false;
  }

  roundTo2Decimals(num){
    return Math.round(num * 100)/100;
  }

  onResize() {
    super.onResize();
    this.getPositionsCoords();
    this.updateTextsAndQuestionMarks();

    // TODO !!! add complete onResize !!!! TODO
  }
}
