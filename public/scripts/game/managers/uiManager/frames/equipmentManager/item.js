let Item = function(equipmentManager,x,y,data,isCurrentlyWear,normalFrame,downFrame,overFrame,disabledFrame,fixedToCamera = true) {
  Phaser.Group.call(this,equipmentManager.state.game);
  data = data || {};
  this.x = x;
  this.y = y;
  this.isCurrentlyWear = isCurrentlyWear || false;
  this.equipmentPositionX = data.x ? data.x : data.x === 0 ? 0 : -1;
  this.equipmentPositionY = data.y ? data.y : data.y === 0 ? 0 : -1;
  this.key = data.key || "boots_1";
  this.price = data.price || 0;
  this.itemType = data.type || "boots";
  this.description = data.description || "asd";
  this.strength = data.strength || 0;
  this.vitality = data.vitality || 0;
  this.intelligence = data.intelligence || 0;
  this.agility = data.agility || 0;
  this.defence = data.defence || 0;
  this.minAttack = data.minAttack || 0;
  this.maxAttack = data.maxAttack || 0;
  this.requiredLevel = data.requiredLevel || 0;
  this.equipmentManager = equipmentManager;
  this.state = equipmentManager.state;
  this.sprite = new Button(equipmentManager.state,0,0,data.key || "boots_1",normalFrame || 0,downFrame || 1,overFrame || 2,disabledFrame || 3,fixedToCamera);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.sprite);
  this.sprite.addOnInputOverFunction(function() {
    // console.log(this.equipmentPositionX);
    // console.log(this.equipmentPositionY);
    this.equipmentManager.itemDescription.show(this);
  }, this);
  this.sprite.addOnInputOutFunction(function() {
    this.equipmentManager.itemDescription.hide(this);
  }, this);
  this.sprite.addOnInputUpFunction(function() {
    this.equipmentManager.itemDescription.hide(this);
    this.equipmentManager.itemMenu.show(this);
  }, this);
  this.add(this.sprite);
};

Item.prototype = Object.create(Phaser.Group.prototype);
Item.prototype.constructor = Item;

Item.prototype.reset = function(x,y) {
  this.x = x;
  this.y = y;
}

Item.prototype.changeView = function(data) {
  this.visible = true;
  this.key = data.key || "boots_1";
  this.price = data.price || 0;
  this.itemType = data.itemType || data.type || "boots";
  this.description = data.description || "asd";
  this.strength = data.strength || 0;
  this.vitality = data.vitality || 0;
  this.intelligence = data.intelligence || 0;
  this.agility = data.agility || 0;
  this.defence = data.defence || 0;
  this.minAttack = data.minAttack || 0;
  this.maxAttack = data.maxAttack || 0;
  this.requiredLevel = data.requiredLevel || 0;
  this.sprite.loadTexture(data.key);
}

Item.prototype.hide = function() {
  this.visible = false;
}
