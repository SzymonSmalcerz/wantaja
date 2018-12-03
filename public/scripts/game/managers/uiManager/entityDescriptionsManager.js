class EntityDescriptionsManager {

  constructor(uiManager) {
    this.uiManager = uiManager;
    this.state = uiManager.state;
  };

  initialize() {
    this.state.descriptions = this.state.add.group();

    this.enemiesDescriptions = this.state.add.group();
    this.playersDescriptions = this.state.add.group();
    this.playerDescriptionsDictionary = {}; //cache of player descriptions => created for faster access to players descriptions
    this.npcsDescriptions = this.state.add.group();
    this.state.descriptions.add(this.enemiesDescriptions);
    this.state.descriptions.add(this.playersDescriptions);
    this.state.descriptions.add(this.npcsDescriptions);
  };

  hideEnemiesDescriptions() {
    this.enemiesDescriptions.visible = false;
  }

  showEnemiesDescriptions() {
    this.enemiesDescriptions.visible = true;
  }

  hideNpcsDescriptions() {
    this.npcsDescriptions.visible = false;
  }

  showNpcsDescriptions() {
    this.npcsDescriptions.visible = true;
  }

  hidePlayersDescriptions() {
    this.playersDescriptions.visible = false;
  }

  showPlayersDescriptions() {
    this.playersDescriptions.visible = true;
  }

  addEnemyDescription(enemy) {
    let enemyDescription = this.enemiesDescriptions.getFirstExists(false);
    if(!enemyDescription){
      enemyDescription = this.state.add.text(enemy.x,enemy.y - 10);
      this.state.styleText(enemyDescription);
      enemyDescription.fontSize = 16;
      this.enemiesDescriptions.add(enemyDescription);
    } else {
      enemyDescription.reset(enemy.x, enemy.y - 10);
    }
    enemyDescription.text = enemy.key + " lvl." + enemy.level;
    enemyDescription.ownerID = enemy.id;
    enemyDescription.anchor.setTo(0.5,1);
    this.uiManager.state.fixText(enemyDescription);
  }

  removeEnemyDescription(enemy) {
    this.enemiesDescriptions.children.forEach(children => {
      if( children.ownerID == enemy.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }

  addNpcDescription(npc) {
    let npcDescription = this.npcsDescriptions.getFirstExists(false);
    if(!npcDescription){
      npcDescription = this.state.add.text(npc.x,npc.y - 15);
      this.state.styleText(npcDescription);
      npcDescription.text = npc.key ? npc.key.split("_").join(" ") : "FATAL ERROR THERE IS NOTHING HEERE";
      npcDescription.fontSize = 16;
      this.npcsDescriptions.add(npcDescription);
    } else {
      npcDescription.reset(npc.x, npc.y - 10);
    }
    npcDescription.ownerID = npc.id;
    npcDescription.anchor.setTo(0.5,1);
    this.uiManager.state.fixText(npcDescription);
  }

  removeNpcDescription(npc) {
    this.npcsDescriptions.children.forEach(children => {
      if( children.ownerID == npc.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }

  addPlayerDescription(player) {
    let playerDescription = this.enemiesDescriptions.getFirstExists(false);
    if(!playerDescription){
      playerDescription = this.state.add.text(player.x,player.y - 15);
      this.state.styleText(playerDescription);
      playerDescription.text = player.nick + " lvl." + player.level;
      playerDescription.fontSize = 16;
      this.enemiesDescriptions.add(playerDescription);
    } else {
      playerDescription.reset(player.x, player.y - 15);
    }
    playerDescription.ownerID = player.id;
    this.playerDescriptionsDictionary[player.id] = playerDescription;
    playerDescription.anchor.setTo(0.5,1);
    this.uiManager.state.fixText(playerDescription);
  }

  removePlayerDescription(player) {
    this.enemiesDescriptions.children.forEach(children => {
      if( children.ownerID == player.id ) {
        children.ownerID = null;
        children.kill();
      }
    });
  }

  update() {
    let that = this;
    Object.keys(that.state.allEntities.objects).forEach(function(id) {
      if(that.playerDescriptionsDictionary[id]) {
        that.playerDescriptionsDictionary[id].reset(that.state.allEntities.objects[id].x, that.state.allEntities.objects[id].y - 15);
      }
    });
  }
};
