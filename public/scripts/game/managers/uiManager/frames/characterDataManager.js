class CharacterDataManager extends UIFrameManager{
  constructor(state,uiManager) {
    super(state,uiManager,Phaser.Keyboard.X,'Your data','characterDataFrame');
    this.dataNames = ["level","attack", "mana", "health", "dodge"];
  }

  addDataDescriptions() {
    this.dataNames.forEach(dataName => {
      this[dataName + "_text"] = this.state.add.text();
      this[dataName + "_questionMark"] = this.state.game.add.sprite(0,0, "questionMark");
      this[dataName + "_description"] = this.state.game.add.sprite(0,0, "characterData_" + dataName + "_description");
      this[dataName + "_description"].visible = false;
      this.addListenersToQuestionMatk(this[dataName + "_questionMark"], this[dataName + "_description"]);
      this.uiManager.blockPlayerMovementsWhenOver(this[dataName + "_questionMark"]);
      this.uiManager.blockPlayerMovementsWhenOver(this[dataName + "_description"]);
      this.state.styleText(this[dataName + "_text"]);
    })
  }

  addTextToGroup() {
    this.dataNames.forEach(dataName => {
      this.frameGroup.add(this[dataName + "_text"]);
    });
  }

  addQuestionMarksToGroup() {
    this.dataNames.forEach(dataName => {
      this.frameGroup.add(this[dataName + "_questionMark"]);
    });
  }

  addDescriptionsToGroup() {
    this.dataNames.forEach(dataName => {
      this.frameGroup.add(this[dataName + "_description"]);
    });
  }

  initialize() {
    this.getPositionsCoords();
    let state = this.state;
    state.characterData = this.frameGroup;

    this.addDataDescriptions();
    this.addTextToGroup();
    this.addQuestionMarksToGroup();
    this.addDescriptionsToGroup();
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
      level : {
        x : this.posX - 30,
        y : this.posY - 100
      },
      attack : {
        x : this.posX - 30,
        y : this.posY - 50
      },
      mana : {
        x : this.posX - 30,
        y : this.posY
      },
      health : {
        x : this.posX - 30,
        y : this.posY + 50
      },
      dodge : {
        x : this.posX - 30,
        y : this.posY + 100
      },
    }
  }

  updateTextsAndQuestionMarks() {
    this.dataNames.forEach(dataName => {
      this[dataName + "_text"].reset(this.positions[dataName].x - 10,this.positions[dataName].y);
      this[dataName + "_questionMark"].reset(this.positions[dataName].x - 40,this.positions[dataName].y + 25);
      this[dataName + "_description"].reset(this.positions[dataName].x,this.positions[dataName].y);
      // this[dataName + "_description"].smoothed = false;
      this[dataName + "_description"].visible = false;
    });

    this.mana_text.text = "mana points: \n" + this.state.player.maxMana;
    this.dodge_text.text = "chance to dodge: \n" + this.roundTo2Decimals(this.state.player.dodge) + "%";
    this.level_text.text = "lvl: " + this.state.player.level +"\nexp: " + this.state.player.experience + "/" + this.state.player.requiredExperience;
    this.health_text.text = "health points: \n" + this.state.player.maxHealth;
    this.attack_text.text = "attack points: \n" + this.roundTo2Decimals(this.state.player.attack * 0.9) + " - " + this.roundTo2Decimals(this.state.player.attack * 1.1);
  }

  roundTo2Decimals(num){
    return Math.round(num * 100)/100;
  }

  onResize() {
    this.getPositionsCoords();
    this.updateTextsAndQuestionMarks();
    super.onResize();
  }
}
