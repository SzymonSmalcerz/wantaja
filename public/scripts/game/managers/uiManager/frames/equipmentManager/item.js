let Item = function(equipmentManager,x,y,data,normalFrame,downFrame,overFrame,disabledFrame,fixedToCamera = true) {

  Phaser.Group.call(this,equipmentManager.state.game);
  this.x = x;
  this.y = y;
  this.key = data.key;
  this.description = data.description;
  this.strength = data.strength;
  this.vitality = data.vitality;
  this.intelligence = data.intelligence;
  this.strength = data.strength;
  this.defence = data.defence;
  this.minAttack = data.minAttack;
  this.maxAttack = data.maxAttack;
  this.requiredLevel = data.requiredLevel;
  this.equipmentManager = equipmentManager;
  this.state = equipmentManager.state;
  this.width = 50;
  this.height = 50;
  this.sprite = new Button(equipmentManager.state.game,x,y,data.key,normalFrame,downFrame,overFrame,disabledFrame,fixedToCamera);
  this.equipmentManager.uiManager.blockPlayerMovementsWhenOver(this.sprite);
  // this.spriteDescription = new ItemDescription(state,this);
  //
  this.sprite.addOnInputOverFunction(function() {
    this.equipmentManager.itemDescription.show(this);
  }, this);
  this.sprite.addOnInputOutFunction(function() {
    this.equipmentManager.itemDescription.hide(this);
  }, this);
  this.sprite.addOnInputUpFunction(function() {
    this.equipmentManager.itemDescription.hide(this);
  }, this);
  this.add(this.sprite);
};

Item.prototype = Object.create(Phaser.Group.prototype);
Item.prototype.constructor = Item;
