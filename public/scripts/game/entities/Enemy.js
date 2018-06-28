
let Enemy = function(game,x,y, id,key  = "spider",health,maxHealth){
  Button.call(this,game,x,y,key,0,0,1);
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.id = id;
  this.health = health;
  this.maxHealth = maxHealth;
  this.inputEnabled = true;
  this.input.pixelPerfectOver = true;
}

Enemy.prototype = Object.create(Button.prototype);
Enemy.prototype.constructor = Enemy;
