let ItemDescription = function(equipmentManager) {
  Phaser.Group.call(this,equipmentManager.state.game);
  this.equipmentManager = equipmentManager;
  this.state = equipmentManager.state;
  this.frame = equipmentManager.state.game.add.sprite(-500, -500, "itemDescriptionFrame");
  this.frame.alpha = 0.7;
  this.frame.anchor.setTo(0.5);

  this.description = equipmentManager.state.add.text(-500,-500);
  this.description.smoothed = false;
  handler.styleText(this.description);
  this.description.anchor.setTo(0.5,0);
  this.description.fontSize = 14;

  this.title = equipmentManager.state.add.text(-500,-500);
  this.title.smoothed = false;
  handler.styleText(this.title);
  this.title.anchor.setTo(0.5,0);

  this.add(this.frame);
  this.add(this.title);
  this.add(this.description);
  this.visible = false;
};

ItemDescription.prototype = Object.create(Phaser.Group.prototype);
ItemDescription.prototype.constructor = ItemDescription;

ItemDescription.prototype.show = function(item) {
  let x = item.x + this.frame.width/2 - 12;
  let y = item.y + this.frame.height + item.height;
  this.frame.reset(x,y);
  this.description.reset(x,y - this.frame.height/2 + 10);
  this.title.reset(x,y - this.frame.height/2 + 10);
  this.description.text = item.key;
  // this.description.text += item.description;
  this.title.text = item.key;
  this.description.text = '\n\n';
  this.description.text += `requiredLevel: ${item.requiredLevel}\n`;
  this.description.text += item.defence ? `defence: ${item.defence}\n` : '';
  this.description.text += item.minAttack ? `attack: ${item.minAttack} - ${item.maxAttack}\n` : '';
  this.description.text += `intelligence: ${item.intelligence}\n`;
  this.description.text += `vitality: ${item.vitality}\n`;
  this.description.text += `agility: ${item.intelligence}\n`;
  this.description.text += `strength: ${item.strength}\n`;
  this.visible = true;
}

ItemDescription.prototype.hide = function() {
  this.visible = false;
}
