class FightAnimationsManager {
  constructor(fightingStageUIManager) {
    this.fightingStageUIManager = fightingStageUIManager;
    this.state = fightingStageUIManager.state;
    this.skillsDictionary = this.state.player.skillsDictionary;
    this.playingAnimation = false;
  };

  initialize() {
    for(let i=0;i<this.skillsDictionary.length;i++) {
      this["skill_" + this.skillsDictionary[i].skillName + "_animation"] = this.state.game.add.sprite(-500,-500,"skill_" + this.skillsDictionary[i].skillName + "_animation");
      this["skill_" + this.skillsDictionary[i].skillName + "_animation"].anchor.setTo(0.5);
      this["skill_" + this.skillsDictionary[i].skillName + "_animation"].skillAnimation = this["skill_" + this.skillsDictionary[i].skillName + "_animation"].animations.add("skill",Array.apply(null, {length: 24}).map(Number.call, Number),8);
      this["skill_" + this.skillsDictionary[i].skillName + "_animation"].visible = false;
      this["skill_" + this.skillsDictionary[i].skillName + "_animation"].howManyTimesPushedButton = 0;
      this.fightingStageUIManager.addToGroup(this["skill_" + this.skillsDictionary[i].skillName + "_animation"]);
    };
  };

  playAnimation(skillName,animationOnPlayer,isThisEnemySkillAnimation,playerDataToChange, moveResult) {

    if(!this.state.player.opponent) {
      console.log("opponent not found ! :C");
      return;
    };

    if(this.playingAnimation) {
      return;
    };
    this.playingAnimation = true;

    let entity;
    if(animationOnPlayer) {
      entity = this.state.player;
    } else {
      entity = this.state.player.opponent;
    };

    // this["skill_" + skillName + "_animation"].bringToTop();
    this["skill_" + skillName + "_animation"].reset(entity.x,entity.y);
    this["skill_" + skillName + "_animation"].visible = true;
    this["skill_" + skillName + "_animation"].smoothed = true;
    this["skill_" + skillName + "_animation"].play("skill");
    this["skill_" + skillName + "_animation"].howManyTimesPushedButton += 1;
    this["skill_" + skillName + "_animation"].skillAnimation.onComplete.addOnce(function() {

      if(playerDataToChange) {
        for (var key in playerDataToChange) {
          if (playerDataToChange.hasOwnProperty(key)) {
              this.state.player[key] = playerDataToChange[key];
          }
        }
      };

      this["skill_" + skillName + "_animation"].howManyTimesPushedButton -= 1;
      if(this["skill_" + skillName + "_animation"].howManyTimesPushedButton <= 0) {
        this["skill_" + skillName + "_animation"].visible = false;
      };
      if(!isThisEnemySkillAnimation && this.state.player.isFighting) {
        this.fightingStageUIManager.damageEnemy(skillName);
      } else {
        if(moveResult) {
          if(moveResult.dodge) {
            this.state.uiManager.showDodgeAlert("you dodged enemy attack !");
          } else if(moveResult.takenHealth) {
            this.state.uiManager.showDamageEnemyAlert("enemy damaged you with\n" + moveResult.takenHealth + " health points");
          } else if(moveResult.addedHealth || moveResult.addedHealth === 0) {
            this.state.uiManager.showHealthAlert("enemy recovered " + moveResult.addedHealth + "\nhealth points");
          }
        }
      }
      this.playingAnimation = false;
    },this);
  };
}
