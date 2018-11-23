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
    if(this.checkIfQuestionMarkAlreadyExists(npc)) {
      // not adding second question mark because one already exists !
      return;
    }
    let glowingQuestionMark = this.getFirstDead();
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
    this.children.forEach(child => {
      if( child.ownerID == npc.id ) {
        child.ownerID = null;
        child.kill();
      }
    });
  }

  // this function checks if question mark is already registered for some npc
  checkIfQuestionMarkAlreadyExists(npc) {
    for(let i=0; i<=this.children.length;i++) {
      if( this.children[i] && this.children[i].ownerID == npc.id ) {
        return true;
      }
    };
    return false;
  }

  onResize() {}
};
