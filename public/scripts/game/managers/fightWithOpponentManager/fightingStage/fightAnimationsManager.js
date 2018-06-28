class FightAnimationsManager {
  constructor(mainFightManager){
    this.mainFightManager = mainFightManager;
    this.state = mainFightManager.state;
    this.skillsDictionary = this.state.player.skillsDictionary;
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

  playAnimation(animationName){
    if(!this.state.player.opponent){
      console.log("opponent not found ! :C");
      return;
    };

    this.state.game.world.bringToTop(this.state["skill_" + animationName + "_animation"]);
    this.state["skill_" + animationName + "_animation"].reset(this.state.player.opponent.x,this.state.player.opponent.y);
    this.state["skill_" + animationName + "_animation"].visible = true;
    this.state["skill_" + animationName + "_animation"].play("skill");
    this.state["skill_" + animationName + "_animation"].howManyTimesPushedButton += 1;
    this.state["skill_" + animationName + "_animation"].skillAnimation.onComplete.add(function(){
      this.state["skill_" + animationName + "_animation"].howManyTimesPushedButton -= 1;
      if(this.state["skill_" + animationName + "_animation"].howManyTimesPushedButton <= 0){
        this.state["skill_" + animationName + "_animation"].visible = false;
      };
    },this);

  };
}
