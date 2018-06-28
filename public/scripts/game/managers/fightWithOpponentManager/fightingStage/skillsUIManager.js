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

  getLeftSkillMargin(howManySkills){
    return (this.state.game.width - (howManySkills - 1) * (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) - this.skillsCss.skillSpriteWidth)/2 + this.skillsCss.skillSpriteWidth/2;
  };


  // skills UI
  setSkillsUI(){
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);


    state.skillDescriptions = state.add.group();
    for(let i=0;i<this.skillsDictionary.length;i++){
      state["skill_" + this.skillsDictionary[i] + "_questionMark"] = this.state.game.add.sprite(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h - this.skillsCss.verticalDistanceToQuestionMark,"questionMark");
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].anchor.setTo(0.5);
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].inputEnabled = true;
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].events.onInputOver.add(function(){
        this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = true;
      },this);
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].events.onInputDown.add(function(){
        this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = true;
      },this);
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].events.onInputOut.add(function(){
        this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
      },this);
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].events.onInputUp.add(function(){
        this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
      },this);
      state["skill_" + this.skillsDictionary[i]] = new Button(this.state.game,this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h,"skill_" + this.skillsDictionary[i],0,0,1,2);
      state["skill_" + this.skillsDictionary[i]].addOnInputUpFunction(function(){
        this.mainFightManager.damageEnemy(this.skillsDictionary[i]);
        this.fightAnimationsManager.playAnimation(this.skillsDictionary[i]);
      },this);
      state["skill_" + this.skillsDictionary[i]].anchor.setTo(0.5);

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
      this.state["skill_" + this.skillsDictionary[i] + "_questionMark"].visible = true;
      this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
    }
  };

  hideSkillButtons(){
    for(let i=0;i<this.skillsDictionary.length;i++){
      this.state["skill_" + this.skillsDictionary[i]].visible = false;
      this.state["skill_" + this.skillsDictionary[i] + "_questionMark"].visible = false;
      this.state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
    }
  };

  addSkillButtonsToStageGroup(fightingStage){
    for(let i=0;i<this.skillsDictionary.length;i++){
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i]]);
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i] + "_questionMark"]);
      fightingStage.add(this.state["skill_" + this.skillsDictionary[i] + "_animation"]);
    };
  };

  onResize(){
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);
    for(let i=0;i<this.skillsDictionary.length;i++) {
      state["skill_" + this.skillsDictionary[i]].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h);
      state["skill_" + this.skillsDictionary[i] + "_questionMark"].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h - this.skillsCss.verticalDistanceToQuestionMark);
      state["skill_" + this.skillsDictionary[i] + "_description"].reset(state.game.width/2,state.game.height - this.skillsCss.h - state["skill_" + this.skillsDictionary[i] + "_description"].height/4 * 3);
      state["skill_" + this.skillsDictionary[i] + "_description"].visible = false;
    };
  };
}
