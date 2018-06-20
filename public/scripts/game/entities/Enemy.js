
let Enemy = function(game,x,y, id,key  = "spider",health,maxHealth){
  Phaser.Sprite.call(this,game,x,y,key);
  game.add.existing(this);
  this.anchor.setTo(0.5);
  game.physics.enable(this);
  this.id = id;
  this.health = health;
  this.maxHealth = maxHealth;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
