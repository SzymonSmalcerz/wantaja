class SkillsUIManager extends Phaser.Group {
  constructor(fightingStageUIManager) {
    super(fightingStageUIManager.state.game);
    this.state = fightingStageUIManager.state;
    this.fightingStageUIManager = fightingStageUIManager;
    this.skillsCss = {
      diff : 4, // how much space each skill will take
      skillSpriteWidth : 48,
      h : 110, // distance from bottom of the world of skill sprite
      left : 0, // distance from left edge of the game of first skill sprite
      verticalDistanceToQuestionMark : 40
    };
    this.skillsDictionary = this.state.player.skillsDictionary;
    this.fightAnimationsManager = new FightAnimationsManager(fightingStageUIManager);
  };

  initialize() {
    this.fightAnimationsManager.initialize();
    this.setSkillsUI();
  };

  animateEnemySkill(skillData) {
    this.fightAnimationsManager.playAnimation(skillData.enemySkillName,true,true,{
      health : skillData.playerHealth
    },skillData.enemyMoveResult);
  }

  getLeftSkillMargin(howManySkills) {
    return (this.state.game.width - (howManySkills - 1) * (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) - this.skillsCss.skillSpriteWidth)/2 + this.skillsCss.skillSpriteWidth/2;
  };


  // skills UI
  setSkillsUI() {
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);
    this.skillDescriptions = state.add.group();
    for(let i=0;i<this.skillsDictionary.length;i++) {
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"] = this.state.game.add.sprite(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h - this.skillsCss.verticalDistanceToQuestionMark,"questionMark");
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].anchor.setTo(0.5);
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].inputEnabled = true;
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputOver.add(function() {
        this["skill_" + this.skillsDictionary[i].skillName + "_description"].show();
      },this);
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputDown.add(function() {
        this["skill_" + this.skillsDictionary[i].skillName + "_description"].show();
      },this);
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputOut.add(function() {
        this["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
      },this);
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].events.onInputUp.add(function() {
        this["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
      },this);
      this["skill_" + this.skillsDictionary[i].skillName] = new Button(this.state,this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h,"skill_" + this.skillsDictionary[i].skillName,0,0,1,2);
      this["skill_" + this.skillsDictionary[i].skillName].addOnInputUpFunction(function() {
        this.fightAnimationsManager.playAnimation(this.skillsDictionary[i].skillName,this.skillsDictionary[i].onPlayer);
      },this);
      this["skill_" + this.skillsDictionary[i].skillName].anchor.setTo(0.5);

      this["skill_" + this.skillsDictionary[i].skillName + "_description"] = new skillDictionary[this.skillsDictionary[i].skillName](this.state.player, this.state);


      // this.skillDescriptions.add(this["skill_" + this.skillsDictionary[i].skillName + "_description"]);
      this.skillDescriptions.add(this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"]);
      this.skillDescriptions.add(this["skill_" + this.skillsDictionary[i].skillName]);
    };

    this.add(this.skillDescriptions);
  };

  addToGroup(sprite) {
    this.add(sprite);
  }

  onMapChange() {
    this.removeAll(true);
  }

  updateStageUI() {
    this.updateButtonsVisibility();
  }

  updateButtonsVisibility() {
    for(let i=0;i<this.skillsDictionary.length;i++) {
      let skillDescription = this["skill_" + this.skillsDictionary[i].skillName + "_description"];
      if(skillDescription.isSkillDisabled()) {
        this["skill_" + this.skillsDictionary[i].skillName].disableButton();
      } else {
        this["skill_" + this.skillsDictionary[i].skillName].enableButton();
      }
    }
  }

  showSkillButtons() {
    for(let i=0;i<this.skillsDictionary.length;i++) {
      let skillDescription = this["skill_" + this.skillsDictionary[i].skillName + "_description"];
      if(skillDescription.isSkillDisabled()) {
        this["skill_" + this.skillsDictionary[i].skillName].visible = true;
        this["skill_" + this.skillsDictionary[i].skillName].disableButton();
      } else {
        this["skill_" + this.skillsDictionary[i].skillName].visible = true;
        this["skill_" + this.skillsDictionary[i].skillName].enableButton();
      }
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].visible = true;
      this["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
    }
  };

  hideSkillButtons() {
    for(let i=0;i<this.skillsDictionary.length;i++) {
      this["skill_" + this.skillsDictionary[i].skillName].visible = false;
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].visible = false;
      this["skill_" + this.skillsDictionary[i].skillName + "_description"].hide();
    }
  };

  // addSkillButtonsToStageGroup(fightingStage) {
  //   for(let i=0;i<this.skillsDictionary.length;i++) {
  //     fightingStage.add(this["skill_" + this.skillsDictionary[i].skillName]);
  //     fightingStage.add(this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"]);
  //     fightingStage.add(this["skill_" + this.skillsDictionary[i].skillName + "_animation"]);
  //   };
  // };

  onResize() {
    let state = this.state;
    this.skillsCss.left = this.getLeftSkillMargin(this.skillsDictionary.length);
    for(let i=0;i<this.skillsDictionary.length;i++) {
      this["skill_" + this.skillsDictionary[i].skillName].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h);
      this["skill_" + this.skillsDictionary[i].skillName + "_questionMark"].reset(this.skillsCss.left + (this.skillsCss.skillSpriteWidth + this.skillsCss.diff) * i,state.game.height - this.skillsCss.h - this.skillsCss.verticalDistanceToQuestionMark);
      this["skill_" + this.skillsDictionary[i].skillName + "_description"].onResize();
    };
  };
}
