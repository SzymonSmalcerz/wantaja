class GlowingSwordsManager {
  constructor(mainFightManager){
    this.state = mainFightManager.state;
    this.mainFightManager = mainFightManager;
  };

  initialize() {
    this.state.glowingSwords = this.state.add.group();
    this.group = this.state.glowingSwords;
  };

  addNewSword(entity) {
    let glowingSword = this.group.getFirstExists(false);
    if(!glowingSword){
      glowingSword = this.state.game.add.sprite(entity.x, entity.y - 20, "fightSwords");
      glowingSword.animations.add("glow", [0,1,2], 5, true);
      this.group.add(glowingSword);
    } else {
      glowingSword.reset(entity.x, entity.y - 20);
    }
    glowingSword.ownerID = entity.id;
    glowingSword.animations.play("glow");
    glowingSword.anchor.setTo(0.5,1);
    return glowingSword;
  }

  removeSword(entity) {
    this.group.children.forEach(children => {
      if( children.ownerID == entity.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }
};
