
let Enemy = function(state,x,y, id,key  = "spider",health,maxHealth) {
  let game = state.game;
  Button.call(this,game,x,y,key,0,0,1);
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.id = id;
  this.health = health;
  this.maxHealth = maxHealth;
  this.inputEnabled = true;
  this.input.pixelPerfectOver = true;
  this.descriptionFrame = state.add.sprite(x,y - 50,"mobDescriptionFrame");
  this.descriptionFrame.alpha = 0.6;
  this.descriptionFrame.anchor.setTo(0.5);
  this.descriptionFrame.visible = false;
  this.addOnInputOverFunction(function() {
    this.descriptionFrame.visible = true;
  },this)
  this.addOnInputDownFunction(function() {
    this.descriptionFrame.visible = false;
  },this)
  this.addOnInputUpFunction(function() {
    this.descriptionFrame.visible = false;
  },this)
  this.addOnInputOutFunction(function() {
    this.descriptionFrame.visible = false;
  },this)
}

Enemy.prototype.reset = function(x,y,key) {
  this.super.reset(x,y,key);
  this.descriptionFrame.reset(x,y);
  this.descriptionFrame.visible = false;
}

Enemy.prototype = Object.create(Button.prototype);
Enemy.prototype.constructor = Enemy;
