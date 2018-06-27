class SkillsUIManager {
  constructor(mainFightManager){
    this.state = mainFightManager.state;
    this.mainFightManager = mainFightManager;
    this.skillsCss = {
      diff : 4, // how much space each skill will take
      skillSpriteWidth : 48,
      h : 120, // distance from bottom of the world of skill sprite
      left : 0 // distance from left edge of the game of first skill sprite
    };
    this.skillsDictionary = ["punch","poison","mana","sword","health"];
  };

  initialize(){
    this.setSkillsUI();
    this.createSkillDescriptionInfos();
  };

  getLeftSkillMargin(howManySkills){
    return (this.state.game.width - (howManySkills - 1) * (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) - this.skillsCss.skillSpriteWidth)/2 + this.skillsCss.skillSpriteWidth/2;
  };


  // skills UI
  setSkillsUI(){
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);

    for(let i=0;i<this.skillsDictionary.length;i++){
      state["skill_" + this.skillsDictionary[i]] = new Button(this.state.game,this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h,"skill_" + this.skillsDictionary[i],0,0,1,2);
      state["skill_" + this.skillsDictionary[i]].addOnInputOverFunction(function(){
        this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = true;
      },this);
      state["skill_" + this.skillsDictionary[i]].addOnInputOutFunction(function(){
        this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
      },this);
      state["skill_" + this.skillsDictionary[i]].addOnInputDownFunction(function(){
        this.mainFightManager.damageEnemy(this.skillsDictionary[i]);
      },this);
      state["skill_" + this.skillsDictionary[i]].anchor.setTo(0.5);
    };
  };

  createSkillDescriptionInfos() {
    let state = this.state;
    state.skillDescriptions = state.add.group();
    for(let i=0;i<this.skillsDictionary.length;i++){
      state["skill_" + this.skillsDictionary[i] + "_description"] = state.game.add.sprite(state.game.width/2,state.game.height/2,"skill_" + this.skillsDictionary[i] + "_description");
      state["skill_" + this.skillsDictionary[i] + "_description"].anchor.setTo(0.5);
      state.skillDescriptions.add(state["skill_" + this.skillsDictionary[i] + "_description"]);
    };
    state.skillDescriptions.setAll("visible",false);
    state.skillDescriptions.fixedToCamera = true;
  };

  showSkillButtons(){
    for(let i=0;i<this.skillsDictionary.length;i++){
      this.state["skill_" + this.skillsDictionary[i]].visible = true;
      // this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = true;
    }
  };

  hideSkillButtons(){
    for(let i=0;i<this.skillsDictionary.length;i++){
      this.state["skill_" + this.skillsDictionary[i]].visible = false;
      this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
    }
  };

  addSkillButtonsToStageGroup(fightingStage){
    for(let i=0;i<this.skillsDictionary.length;i++){
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i]]);
    }
  };

  onResize(){
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);
    state.skill_punch.reset(this.skillsCss.left,state.game.height - this.skillsCss.h);
    state.skill_health.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff),state.game.height - this.skillsCss.h);
    state.skill_poison.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 2,state.game.height - this.skillsCss.h)
    state.skill_mana.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 3,state.game.height - this.skillsCss.h)
    state.skill_sword.reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * 4,state.game.height - this.skillsCss.h);

    for(let i=0;i<this.skillsDictionary.length;i++){
      state["skill_" + this.skillsDictionary[i]].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h);
    };
  };
}
