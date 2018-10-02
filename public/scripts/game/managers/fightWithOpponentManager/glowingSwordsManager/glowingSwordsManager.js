class GlowingSwordsManager extends Phaser.Group {
  constructor(fightWithOpponentManager) {
    super(fightWithOpponentManager.state.game);
    this.state = fightWithOpponentManager.state;
    this.fightWithOpponentManager = fightWithOpponentManager;
  };

  initialize() {};

  onMapChange() {
    this.removeAll(true);
  }

  addNewSword(entity) {
    let glowingSword = this.getFirstExists(false);
    if(!glowingSword) {
      glowingSword = this.state.game.add.sprite(entity.x, entity.y - 20, "fightSwords");
      glowingSword.animations.add("glow", [0,1,2], 5, true);
      this.add(glowingSword);
    } else {
      glowingSword.reset(entity.x, entity.y - 20);
    }
    glowingSword.ownerID = entity.id;
    glowingSword.animations.play("glow");
    glowingSword.anchor.setTo(0.5,1);
    return glowingSword;
  }

  removeSword(entity) {
    this.children.forEach(children => {
      if( children.ownerID == entity.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }

  onResize() {}
};
