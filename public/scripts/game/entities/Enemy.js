
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
  this.descriptionText = state.add.text(x,y - this.height/2);
  this.descriptionText.anchor.setTo(0.5);
  let textCss = {
    font : "14px bold",
    fontWeight : "900",
    fill : "#FFFFFF"
  }
  this.descriptionText.setStyle(textCss);
  this.descriptionText.text = key + " lvl. 1";
}


Enemy.prototype = Object.create(Button.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.hideDescription = function() {
  this.descriptionText.visible = false;
}

Enemy.prototype.showDescription = function() {
  this.descriptionText.visible = true;
}

Enemy.prototype.toggleDescription = function() {
  this.descriptionText.visible = !this.descriptionText.visible;
}

Enemy.prototype.reset = function(x,y,key) {
  Button.prototype.reset.call(this,x,y,key);
}

Enemy.prototype.kill = function() {
  Button.prototype.kill.call(this);
}
