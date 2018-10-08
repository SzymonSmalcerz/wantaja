class QuestionMarksManager extends Phaser.Group {
  constructor(missionManager) {
    super(missionManager.state.game);
    this.state = missionManager.state;
    this.missionManager = missionManager;
  };

  initialize() {};

  onMapChange() {
    this.removeAll(true);
  }

  addNewQuestionMark(npc) {
    let glowingQuestionMark = this.getFirstExists(false);
    if(!glowingQuestionMark) {
      glowingQuestionMark = this.state.game.add.sprite(npc.x, npc.y - 20, "questionMarkNpc");
      glowingQuestionMark.animations.add("glow", [0,1,2,1], 3, true);
      this.add(glowingQuestionMark);
    } else {
      glowingQuestionMark.reset(npc.x, npc.y - 20);
    }
    glowingQuestionMark.ownerID = npc.id;
    glowingQuestionMark.animations.play("glow");
    glowingQuestionMark.anchor.setTo(0.5,1);
    return glowingQuestionMark;
  }

  removeQuestionMark(npc) {
    this.children.forEach(children => {
      if( children.ownerID == npc.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }

  onResize() {}
};
