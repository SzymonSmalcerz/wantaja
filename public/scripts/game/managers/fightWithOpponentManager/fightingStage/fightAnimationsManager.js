class FightAnimationsManager {
  constructor(mainFightManager){
    this.mainFightManager = mainFightManager;
    this.state = mainFightManager.state;
    this.skillsDictionary = this.state.player.skillsDictionary;
    this.playingAnimation = false;
  };

  initialize(){
    for(let i=0;i<this.skillsDictionary.length;i++) {
      this.state["skill_" + this.skillsDictionary[i] + "_animation"] = this.state.game.add.sprite(-500,-500,"skill_" + this.skillsDictionary[i] + "_animation");
      this.state["skill_" + this.skillsDictionary[i] + "_animation"].anchor.setTo(0.5);
      this.state["skill_" + this.skillsDictionary[i] + "_animation"].skillAnimation = this.state["skill_" + this.skillsDictionary[i] + "_animation"].animations.add("skill",Array.apply(null, {length: 24}).map(Number.call, Number),8);
      this.state["skill_" + this.skillsDictionary[i] + "_animation"].visible = false;
      this.state["skill_" + this.skillsDictionary[i] + "_animation"].howManyTimesPushedButton = 0;
    };
  };

  playAnimation(skillName,isThisEnemySkillAnimation){
    if(!this.state.player.opponent){
      console.log("opponent not found ! :C");
      return;
    };

    if(this.playingAnimation){
      return;
    };
    this.playingAnimation = true;

    let entity;
    if(isThisEnemySkillAnimation){
      entity = this.state.player;
    } else {
      entity = this.state.player.opponent;
    };

    this.state["skill_" + skillName + "_animation"].bringToTop();
    this.state["skill_" + skillName + "_animation"].reset(entity.x,entity.y);
    this.state["skill_" + skillName + "_animation"].visible = true;
    this.state["skill_" + skillName + "_animation"].play("skill");
    this.state["skill_" + skillName + "_animation"].howManyTimesPushedButton += 1;
    console.log("inside animation");
    this.state["skill_" + skillName + "_animation"].skillAnimation.onComplete.addOnce(function(){
      this.state["skill_" + skillName + "_animation"].howManyTimesPushedButton -= 1;
      if(this.state["skill_" + skillName + "_animation"].howManyTimesPushedButton <= 0){
        this.state["skill_" + skillName + "_animation"].visible = false;
      };
      console.log(isThisEnemySkillAnimation);
      if(!isThisEnemySkillAnimation && this.state.player.isFighting){
        console.log("sendiiiing");
        this.mainFightManager.damageEnemy(skillName);
      };
      this.playingAnimation = false;
    },this);
  };
}