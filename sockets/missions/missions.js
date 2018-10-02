class HighLight {
  constructor(npcKey, mapKey) {
    this.npcKey = npcKey;
    this.mapKey = mapKey;
  }
}

/*
  TYPES:
    - goto (go to some npc)
    - kill (kill some enemies)
    - getitem (get some item)
*/
class Stage {
  constructor(highLights, type) {
    this.highLights = highLights;
    this.type = type;
  }
}

class Stage_goto extends Stage {
  constructor(highLights) {
    super(highLights, 'goto');
  }
}

class Stage_getitem extends Stage {
  constructor(highLights, itemKey) {
    super(highLights, 'getitem');
    this.itemKey = itemKey;
  }
}

class Stage_kill extends Stage {
  constructor(highLights, enemyKey, numberLeft, numberOryginal) {
    super(highLights, 'kill');
    this.enemyKey = enemyKey;
    this.numberLeft = numberLeft;
    this.numberOryginal = numberOryginal;
  }
}

class Mission {
  constructor(stages, currentStageIndex) {
    this.stages = stages;
    this.currentStageIndex = currentStageIndex || 0;
    this.currentStage = this.stages[this.currentStageIndex];
  }

  changeStage() {
    this.currentStageIndex += 1;
    if(this.currentStageIndex >= this.stages.length) {
      return true;
    }
    this.currentStage = this.stages[this.currentStageIndex];
  }
}

module.exports = Mission
