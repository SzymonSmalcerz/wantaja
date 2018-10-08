class HighLight {
  constructor(npcKey, mapKey) {
    this.npcKey = npcKey;
    this.mapKey = mapKey;
  }
}

class Dialog {
  constructor(missionDescription, response) {
    this.missionDescription = missionDescription;
    this.response = response;
  }
}

/*
  TYPES:
    - goto (go to some npc)
    - kill (kill some enemies)
    - getitem (get some item)
*/
class Stage {
  constructor(highLights, type, name) {
    this.highLights = highLights;
    this.type = type;
    this.name = name;
  }
}

class Stage_goto extends Stage {
  constructor(highLights, stageName, dialogs) {
    super(highLights, 'goto', stageName);
    this.dialogs = dialogs;
  }
}

class Stage_getitem extends Stage {
  constructor(highLights, stageName, itemKey) {
    super(highLights, 'getitem', stageName);
    this.itemKey = itemKey;
  }
}

class Stage_kill extends Stage {
  constructor(highLights, stageName, enemyKey, numberLeft, numberOryginal) {
    super(highLights, 'kill', stageName);
    this.enemyKey = enemyKey;
    this.numberLeft = numberLeft;
    this.numberOryginal = numberOryginal;
  }
}

class Mission {
  constructor(stages, currentStageIndex, reward, missionName, requiredLevel) {
    this.stages = stages;
    this.reward = reward;
    this.missionName = missionName;
    this.requiredLevel = requiredLevel || 1;
  }

  getStage(index) {
    return this.stages[index];
  }

  getStageIndex(stageName) {
    return this.stages.reduce((total,stage,i) => {
      if(stageName == stage.name) {
        return i;
      } else {
        return total;
      }
    }, -1)
  }

  isDone(index) {
    if(index >= this.stages.length) {
      return true;
    } else {
      return false;
    }
  }

  getReward() {
    return this.reward;
  }
}

// let mission_killSpiders = new Mission([
//   new Stage_goto([new HighLight('greengrove_john', 'Greengrove')]),
//   new Stage_kill([], 'spider', 10, 10),
//   new Stage_goto([new HighLight('greengrove_john', 'Greengrove')])
// ], 0, {
//   money : 100
// });
module.exports = {
  Mission,
  Stage_goto,
  Stage_getitem,
  Stage_kill,
  HighLight,
  Dialog
}
