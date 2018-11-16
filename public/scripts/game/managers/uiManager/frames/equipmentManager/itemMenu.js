let ItemMenu = function(equipmentManager, x, y) {
  Phaser.Group.call(this,equipmentManager.state.game);

  this.currentItem = null;

  this.x = x;
  this.y = y;
  this.equipmentManager = equipmentManager;
  this.state = equipmentManager.state;

  this.frame = equipmentManager.state.game.add.sprite(0, 0, "itemActionBackground");
  // this.frame.alpha = 0.9;
  this.frame.anchor.setTo(0.5);
  this.add(this.frame);


  this.title = equipmentManager.state.add.text(-20,-115);
  this.title.smoothed = false;
  handler.styleText(this.title);
  this.title.anchor.setTo(0.5,0);
  this.add(this.title);

  this.bonuses = equipmentManager.state.add.text(0,-80);
  this.bonuses.smoothed = false;
  handler.styleText(this.bonuses);
  this.bonuses.anchor.setTo(0.5,0);
  this.bonuses.fontSize = 18;
  this.bonuses.text = "bonuses:"
  this.add(this.bonuses);

  this.description = equipmentManager.state.add.text(-70,-60);
  this.description.smoothed = false;
  handler.styleText(this.description);
  this.description.anchor.setTo(0,0);
  this.description.fontSize = 17;
  this.add(this.description);

  this.closeButton = new Button(this.state,75, -117,"closeButton",0,1,2,3);
  this.add(this.closeButton);

  this.takeOffButton = new Button(this.state,-45, 94,"takeOffButton",0,1,2,3);
  this.takeOffButton.anchor.setTo(0.5);
  this.add(this.takeOffButton);
  this.takeOffButton.addOnInputUpFunction(function() {
    this.equipmentManager.emitTakeOffItemSignal(this.currentItem);
    this.hide();
  }, this);

  this.dressButton = new Button(this.state,-45, 94,"dressButton",0,1,2,3);
  this.dressButton.anchor.setTo(0.5);
  this.add(this.dressButton);
  this.dressButton.addOnInputUpFunction(function() {
    this.equipmentManager.emitDressItemSignal(this.currentItem);
    this.hide();
  }, this);

  this.discardButton = new Button(this.state,45, 94,"discardButton",0,1,2,3);
  this.discardButton.anchor.setTo(0.5);
  this.add(this.discardButton);
  this.discardButton.addOnInputUpFunction(function() {
    this.equipmentManager.showDiscardFrame(this.currentItem);
    this.hide();
  }, this);

  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.closeButton,true);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.takeOffButton,true);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.dressButton,true);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.discardButton,true);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.frame,true);

  this.closeButton.addOnInputDownFunction(function(){
    this.hide();
  },this);

  this.visible = false;
};

ItemMenu.prototype = Object.create(Phaser.Group.prototype);
ItemMenu.prototype.constructor = ItemMenu;

ItemMenu.prototype.reset = function(x,y) {
  this.x = x;
  this.y = y;
}

ItemMenu.prototype.show = function(item) {

  this.currentItem = item;
  this.title.text = item.key;
  this.title.fontSize = 100;
  while(this.title.width > 110 && this.title.height > 30) {
    this.title.fontSize -= 1;
  }

  if(item.isCurrentlyWear) {
    this.dressButton.visible = false;
    this.takeOffButton.visible = true;
  } else {
    this.dressButton.visible = true;
    this.takeOffButton.visible = false;
  }


  this.description.text = '';
  this.description.text += 'strength: ' + item.strength + '\n';
  this.description.text += 'vitality: ' + item.vitality + '\n';
  this.description.text += 'intelligence: ' + item.intelligence + '\n';
  this.description.text += 'agility: ' + item.agility + '\n';
  this.description.text += item.defence ? `defence: ${item.defence}\n` : '';
  this.description.text += item.minAttack ? `attack: ${item.minAttack} - ${item.maxAttack}\n` : '';

  this.visible = true;

  this.equipmentManager.state.fixText(this.title);
  this.equipmentManager.state.fixText(this.bonuses);
  this.equipmentManager.state.fixText(this.description);
}

ItemMenu.prototype.hide = function() {
  this.visible = false;
}
