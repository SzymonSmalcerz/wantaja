class SkillsUIManager {
  constructor(mainFightManager){
    this.state = mainFightManager.state;
    this.mainFightManager = mainFightManager;
    this.skillsCss = {
      diff : 4, // how much space each skill will take
      skillSpriteWidth : 48,
      h : 100, // distance from bottom of the world of skill sprite
      left : 0, // distance from left edge of the game of first skill sprite
      verticalDistanceToQuestionMark : 40
    };
    this.skillsDictionary = this.state.player.skillsDictionary;
    this.fightAnimationsManager = new FightAnimationsManager(mainFightManager);
  };

  initialize(){
    this.setSkillsUI();
    this.fightAnimationsManager.initialize();
  };

  animateEnemySkill(skillData){
    this.fightAnimationsManager.playAnimation(skillData.enemySkillName,true,true,{
      health : skillData.playerHealth
    });
  }

  getLeftSkillMargin(howManySkills){
    return (this.state.game.width - (howManySkills - 1) * (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) - this.skillsCss.skillSpriteWidth)/2 + this.skillsCss.skillSpriteWidth/2;
  };


  // skills UI
  setSkillsUI(){
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);


    state.skillDescriptions = state.add.group();
    for(let i=0;i<this.skillsDictionary.length;i++){
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"] = this.state.game.add.sprite(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h - this.skillsCss.verticalDistanceToQuestionMark,"questionMark");
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].anchor.setTo(0.5);
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].inputEnabled = true;
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputOver.add(function(){
        this.state["skill_" + this.skillsDictionary[i].skillName + "_description"].show();
      },this);
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputDown.add(function(){
        this.state["skill_" + this.skillsDictionary[i].skillName + "_description"].show();
      },this);
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputOut.add(function(){
        this.state["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
      },this);
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputUp.add(function(){
        this.state["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
      },this);
      state["skill_" + this.skillsDictionary[i].skillName] = new Button(this.state.game,this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h,"skill_" + this.skillsDictionary[i].skillName,0,0,1,2);
      state["skill_" + this.skillsDictionary[i].skillName].addOnInputUpFunction(function(){
        this.fightAnimationsManager.playAnimation(this.skillsDictionary[i].skillName,this.skillsDictionary[i].onPlayer);
      },this);
      state["skill_" + this.skillsDictionary[i].skillName].anchor.setTo(0.5);

      state["skill_" + this.skillsDictionary[i].skillName + "_description"] = new skillDictionary[this.skillsDictionary[i].skillName](this.state.player, this.state);
    };
  };

  updateStageUI() {
    console.log("updateStageUI called");
    this.updateButtonsVisibility();
  }

  updateButtonsVisibility(){
    for(let i=0;i<this.skillsDictionary.length;i++){
      let skillDescription = this.state["skill_" + this.skillsDictionary[i].skillName + "_description"];
      if(skillDescription.isSkillDisabled()) {
        this.state["skill_" + this.skillsDictionary[i].skillName].disableButton();
      } else {
        this.state["skill_" + this.skillsDictionary[i].skillName].enableButton();
      }
    }
  }

  showSkillButtons(){
    for(let i=0;i<this.skillsDictionary.length;i++){
      let skillDescription = this.state["skill_" + this.skillsDictionary[i].skillName + "_description"];
      if(skillDescription.isSkillDisabled()) {
        this.state["skill_" + this.skillsDictionary[i].skillName].visible = true;
        this.state["skill_" + this.skillsDictionary[i].skillName].disableButton();
      } else {
        this.state["skill_" + this.skillsDictionary[i].skillName].visible = true;
        this.state["skill_" + this.skillsDictionary[i].skillName].enableButton();
      }
      this.state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].visible = true;
      this.state["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
    }
  };

  hideSkillButtons(){
    for(let i=0;i<this.skillsDictionary.length;i++){
      this.state["skill_" + this.skillsDictionary[i].skillName].visible = false;
      this.state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].visible = false;
      this.state["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
    }
  };

  addSkillButtonsToStageGroup(fightingStage){
    for(let i=0;i<this.skillsDictionary.length;i++) {
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i].skillName]);
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"]);
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i].skillName + "_animation"]);
    };
  };

  onResize() {
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);
    for(let i=0;i<this.skillsDictionary.length;i++) {
      state["skill_" + this.skillsDictionary[i].skillName].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h);
      state["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h - this.skillsCss.verticalDistanceToQuestionMark);
      // state["skill_" + this.skillsDictionary[i].skillName + "_description"].reset(state.game.width/2,state.game.height - this.skillsCss.h - state["skill_" + this.skillsDictionary[i].skillName + "_description"].height/4 * 3);
      // state["skill_" + this.skillsDictionary[i].skillName + "_description"].visible = false;
      state["skill_" + this.skillsDictionary[i].skillName + "_description"].onResize();
    };
  };
}
